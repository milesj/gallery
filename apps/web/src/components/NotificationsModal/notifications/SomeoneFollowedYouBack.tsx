import { SomeoneFollowedYouBackFragment$key } from '__generated__/SomeoneFollowedYouBackFragment.graphql';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { BaseM } from '~/components/core/Text/Text';
import HoverCardOnUsername from '~/components/HoverCard/HoverCardOnUsername';
import { SomeoneFollowedYouBackQueryFragment$key } from '~/generated/SomeoneFollowedYouBackQueryFragment.graphql';

type SomeoneFollowedYouBackProps = {
  notificationRef: SomeoneFollowedYouBackFragment$key;
  queryRef: SomeoneFollowedYouBackQueryFragment$key;
};

export function SomeoneFollowedYouBack({ notificationRef, queryRef }: SomeoneFollowedYouBackProps) {
  const query = useFragment(
    graphql`
      fragment SomeoneFollowedYouBackQueryFragment on Query {
        ...HoverCardOnUsernameFollowFragment
      }
    `,
    queryRef
  );

  const notification = useFragment(
    graphql`
      fragment SomeoneFollowedYouBackFragment on SomeoneFollowedYouBackNotification {
        count

        followers(last: 1) {
          edges {
            node {
              ...HoverCardOnUsernameFragment
            }
          }
        }
      }
    `,
    notificationRef
  );

  const count = notification.count ?? 1;
  const lastFollower = notification.followers?.edges?.[0]?.node;

  return (
    <BaseM>
      <strong>
        {count > 1 ? (
          <>{count} collectors</>
        ) : (
          <>
            {lastFollower ? (
              <HoverCardOnUsername userRef={lastFollower} queryRef={query} />
            ) : (
              'Someone'
            )}
          </>
        )}
      </strong>{' '}
      followed you back
    </BaseM>
  );
}