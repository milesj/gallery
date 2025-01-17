import { createElement, useCallback, useEffect, useMemo } from 'react';
import { fetchQuery, graphql, useFragment, useRelayEnvironment } from 'react-relay';

import { useTokenStateManagerContext } from '~/contexts/TokenStateManagerContext';
import { TokenFailureBoundaryFragment$key } from '~/generated/TokenFailureBoundaryFragment.graphql';
import { TokenFailureBoundaryPollerQuery } from '~/generated/TokenFailureBoundaryPollerQuery.graphql';
import {
  ReportingErrorBoundary,
  ReportingErrorBoundaryProps,
} from '~/shared/errors/ReportingErrorBoundary';

import {
  FallbackProps,
  FallbackWrapper,
  TokenPreviewErrorFallback,
  TokenPreviewLoadingFallback,
} from './TokenFailureFallbacks';

type Props = {
  tokenRef: TokenFailureBoundaryFragment$key;
  fallback?: ReportingErrorBoundaryProps['fallback'];
  loadingFallback?: ReportingErrorBoundaryProps['fallback'];
} & Omit<ReportingErrorBoundaryProps, 'fallback'> &
  FallbackProps;

export function TokenFailureBoundary({
  tokenRef,
  fallback: errorFallback,
  loadingFallback: _loadingFallback,
  fallbackAspectSquare = true,
  variant = 'medium',
  ...rest
}: Props) {
  const tokenFragment = useFragment(
    graphql`
      fragment TokenFailureBoundaryFragment on Token {
        dbid
        ...TokenFailureFallbacksErrorFallbackFragment
        ...TokenFailureFallbacksLoadingFallbackFragment
      }
    `,
    tokenRef
  );

  const fallback = useMemo(() => {
    return (
      errorFallback || (
        <FallbackWrapper fallbackAspectSquare={fallbackAspectSquare} variant={variant}>
          <TokenPreviewErrorFallback
            tokenRef={tokenFragment}
            fallbackAspectSquare={fallbackAspectSquare}
            variant={variant}
          />
        </FallbackWrapper>
      )
    );
  }, [errorFallback, fallbackAspectSquare, tokenFragment, variant]);

  const loadingFallback = useMemo(() => {
    return (
      _loadingFallback || (
        <FallbackWrapper fallbackAspectSquare={fallbackAspectSquare} variant={variant}>
          <TokenPreviewLoadingFallback
            tokenRef={tokenFragment}
            fallbackAspectSquare={fallbackAspectSquare}
            variant={variant}
          />
        </FallbackWrapper>
      )
    );
  }, [_loadingFallback, fallbackAspectSquare, tokenFragment, variant]);

  const { getTokenState, clearTokenFailureState, markTokenAsPolling, markTokenAsFailed } =
    useTokenStateManagerContext();

  const { dbid: tokenId } = tokenFragment;
  const token = getTokenState(tokenId);
  const additionalTags = useMemo(() => ({ tokenId }), [tokenId]);

  const relayEnvironment = useRelayEnvironment();

  useEffect(
    function pollTokenWhileStillSyncing() {
      const POLLING_INTERNVAL_MS = 5000;
      let timeoutId: ReturnType<typeof setTimeout>;

      async function reFetchToken() {
        const fetchedToken = await fetchQuery<TokenFailureBoundaryPollerQuery>(
          relayEnvironment,
          graphql`
            query TokenFailureBoundaryPollerQuery($id: DBID!) {
              tokenById(id: $id) {
                ... on Token {
                  media {
                    __typename
                    ... on SyncingMedia {
                      previewURLs {
                        small
                        medium
                        large
                      }
                      fallbackMedia {
                        mediaURL
                      }
                    }
                  }
                  # Ensure relevant polling component gets its data refetched
                  # eslint-disable-next-line relay/must-colocate-fragment-spreads
                  ...getPreviewImageUrlsInlineDangerouslyFragment
                }
              }
            }
          `,
          { id: tokenId }
        ).toPromise();

        const media = fetchedToken?.tokenById?.media;

        if (
          media?.__typename === 'SyncingMedia' &&
          !media?.previewURLs?.small &&
          !media?.previewURLs?.medium &&
          !media?.previewURLs?.large &&
          !media?.fallbackMedia?.mediaURL
        ) {
          // We're still syncing without a fallback, so queue up another refetch
          timeoutId = setTimeout(reFetchToken, POLLING_INTERNVAL_MS);
        } else {
          // If the token was failing before, we need to make sure
          // that it's error state gets cleared on the chance
          // that it just got loaded.
          clearTokenFailureState([tokenId]);
        }
      }

      if (token?.isLoading && !token?.isPolling) {
        reFetchToken();
        markTokenAsPolling(tokenId);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [
      clearTokenFailureState,
      markTokenAsPolling,
      relayEnvironment,
      token?.isLoading,
      token?.isPolling,
      tokenId,
    ]
  );

  const handleError = useCallback(
    (error: Error) => {
      markTokenAsFailed(tokenId, error);
    },
    [markTokenAsFailed, tokenId]
  );

  if (token?.isLoading || token?.refreshingMetadata) {
    return <>{loadingFallback}</>;
  }

  if (token?.isFailed) {
    if (typeof fallback === 'function') {
      return createElement(fallback, { error: new Error() });
    } else {
      return <>{fallback}</>;
    }
  }

  return (
    <ReportingErrorBoundary
      key={token?.retryKey ?? 0}
      onError={handleError}
      additionalTags={additionalTags}
      fallback={fallback}
      {...rest}
    />
  );
}
