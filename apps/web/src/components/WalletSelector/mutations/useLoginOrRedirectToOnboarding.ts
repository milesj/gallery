import { useRouter } from 'next/router';
import { startTransition, useCallback, useContext } from 'react';
import { graphql } from 'relay-runtime';

import { useModalActions } from '~/contexts/modal/ModalContext';
import { RelayResetContext } from '~/contexts/RelayResetContext';
import {
  useLoginOrRedirectToOnboardingMutation,
  useLoginOrRedirectToOnboardingMutation$variables,
} from '~/generated/useLoginOrRedirectToOnboardingMutation.graphql';
import { usePromisifiedMutation } from '~/shared/relay/usePromisifiedMutation';

export default function useLoginOrRedirectToOnboarding() {
  const [login, isMutating] = usePromisifiedMutation<useLoginOrRedirectToOnboardingMutation>(
    graphql`
      mutation useLoginOrRedirectToOnboardingMutation($mechanism: AuthMechanism!) {
        login(authMechanism: $mechanism) {
          __typename

          ... on LoginPayload {
            userId @required(action: THROW)
          }
          ... on ErrUserNotFound {
            message
          }
          ... on ErrAuthenticationFailed {
            message
          }
          ... on ErrDoesNotOwnRequiredToken {
            message
          }
        }
      }
    `
  );

  type Props = {
    authMechanism: useLoginOrRedirectToOnboardingMutation$variables;
    userExists: boolean;
    userFriendlyWalletName?: string;
  };

  const { push } = useRouter();

  const { hideModal } = useModalActions();
  const reset = useContext(RelayResetContext);
  const mutate = useCallback(
    async ({
      authMechanism,
      userExists,
      userFriendlyWalletName = 'unknown',
    }: Props): Promise<string | undefined> => {
      if (userExists) {
        const { login: result } = await login({
          variables: authMechanism,
        });

        if (!result) {
          throw new Error('login failed to execute. response data missing');
        }

        if (result.__typename === 'LoginPayload') {
          hideModal({ id: 'auth' });

          // Wipe the relay cache and show the old content while
          // the new content is loading in the background.
          startTransition(() => {
            reset?.();
          });

          return result.userId;
        }

        if (result && 'message' in result) {
          throw new Error(result.message);
        }

        throw new Error(`Unexpected type returned from login mutation: ${result?.__typename}`);
      } else {
        // Redirect user to the onboarding flow with necessary input params to create an account
        if (authMechanism.mechanism.eoa) {
          push({
            pathname: '/onboarding/welcome',
            query: {
              authMechanismType: 'eoa',
              chain: authMechanism.mechanism.eoa.chainPubKey.chain,
              address: authMechanism.mechanism.eoa.chainPubKey.pubKey,
              nonce: authMechanism.mechanism.eoa.nonce,
              signature: authMechanism.mechanism.eoa.signature,
              userFriendlyWalletName,
            },
          });
        }

        if (authMechanism.mechanism.gnosisSafe) {
          push({
            pathname: '/onboarding/welcome',
            query: {
              authMechanismType: 'gnosisSafe',
              address: authMechanism.mechanism.gnosisSafe.address,
              nonce: authMechanism.mechanism.gnosisSafe.nonce,
              userFriendlyWalletName,
            },
          });
        }

        return;
      }
    },
    // remove `push` from dependency array as it'll trigger this callback to change on route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [login]
  );

  return [mutate, isMutating] as const;
}
