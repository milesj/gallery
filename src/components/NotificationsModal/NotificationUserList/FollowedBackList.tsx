import { FollowedBackListFragment$key } from '__generated__/FollowedBackListFragment.graphql';
import { useCallback } from 'react';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { USERS_PER_PAGE } from '~/components/NotificationsModal/constants';
import { PureUserList } from '~/components/NotificationsModal/NotificationUserList/PureUserList';

type FollowedBackListProps = {
  notificationRef: FollowedBackListFragment$key;
};

export function FollowedBackList({ notificationRef }: FollowedBackListProps) {
  const {
    data: notification,
    loadPrevious,
    isLoadingPrevious,
    hasPrevious,
  } = usePaginationFragment(
    graphql`
      fragment FollowedBackListFragment on SomeoneFollowedYouBackNotification
      @refetchable(queryName: "RefetchableFollowedBackListFragment") {
        followers(last: $notificationUsersLast, before: $notificationUsersBefore)
          @connection(key: "FollowedBackListFragment_followers") {
          edges {
            __typename
          }
          ...PureUserListFragment
        }
      }
    `,
    notificationRef
  );

  const handleLoadMore = useCallback(() => {
    loadPrevious(USERS_PER_PAGE);
  }, [loadPrevious]);

  return (
    <PureUserList
      loadMore={handleLoadMore}
      isLoading={isLoadingPrevious}
      hasMore={hasPrevious}
      connectionRef={notification.followers}
    />
  );
}