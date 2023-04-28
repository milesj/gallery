import clsx from 'clsx';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { graphql, useFragment } from 'react-relay';

import { Typography } from '~/components/Typography';
import { FollowButtonQueryFragment$key } from '~/generated/FollowButtonQueryFragment.graphql';
import { FollowButtonUserFragment$key } from '~/generated/FollowButtonUserFragment.graphql';
import useFollowUser from '~/shared/relay/useFollowUser';
import { useLoggedInUserId } from '~/shared/relay/useLoggedInUserId';
import useUnfollowUser from '~/shared/relay/useUnfollowUser';

type Props = {
  style?: ViewProps['style'];
  queryRef: FollowButtonQueryFragment$key;
  userRef: FollowButtonUserFragment$key;
  className?: string;
  source?: string; // where the FollowButton is being used, for analytics
};

export function FollowButton({ queryRef, userRef, style }: Props) {
  const loggedInUserQuery = useFragment(
    graphql`
      fragment FollowButtonQueryFragment on Query {
        viewer {
          ... on Viewer {
            user {
              dbid
              following @required(action: THROW) {
                id @required(action: THROW)
              }
            }
          }
        }

        ...useLoggedInUserIdFragment
        ...useFollowUserFragment
        ...useUnfollowUserFragment
      }
    `,
    queryRef
  );

  const userToFollow = useFragment(
    graphql`
      fragment FollowButtonUserFragment on GalleryUser {
        id
        dbid
      }
    `,
    userRef
  );

  const loggedInUserId = useLoggedInUserId(loggedInUserQuery);
  const followingList = loggedInUserQuery.viewer?.user?.following;

  const isFollowing = useMemo(() => {
    if (!followingList) {
      return false;
    }
    const followingIds = new Set(
      followingList.map((following: { id: string } | null) => following?.id)
    );
    return followingIds.has(userToFollow.id);
  }, [followingList, userToFollow.id]);

  const followUser = useFollowUser({ queryRef: loggedInUserQuery });
  const unfollowUser = useUnfollowUser({ queryRef: loggedInUserQuery });

  const handleFollowPress = useCallback(async () => {
    await followUser(userToFollow.dbid);
  }, [userToFollow.dbid, followUser]);

  const handleUnfollowPress = useCallback(async () => {
    await unfollowUser(userToFollow.dbid);
  }, [userToFollow.dbid, unfollowUser]);

  const isSelf = loggedInUserId === userToFollow?.id;

  const followChip = useMemo(() => {
    if (isSelf) {
      return null;
    } else if (isFollowing) {
      return (
        <FollowChip variant="unfollow" onPress={handleUnfollowPress}>
          Following
        </FollowChip>
      );
    } else {
      return (
        <FollowChip variant="follow" onPress={handleFollowPress}>
          Follow
        </FollowChip>
      );
    }
  }, [handleFollowPress, handleUnfollowPress, isSelf, isFollowing]);

  return <View style={style}>{followChip}</View>;
}

function FollowChip({
  children,
  variant,
  onPress,
}: PropsWithChildren<{
  variant: 'follow' | 'unfollow';
  onPress: TouchableOpacityProps['onPress'];
}>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx('flex h-6 w-20 items-center justify-center rounded-sm px-2', {
        'bg-black dark:bg-white': variant === 'follow',
        'bg-white dark:bg-black border border-faint dark:border-graphite': variant === 'unfollow',
      })}
    >
      <Typography
        className={clsx('text-sm', {
          'text-white dark:text-black': variant === 'follow',
          'text-black dark:text-white': variant === 'unfollow',
        })}
        font={{ family: 'ABCDiatype', weight: 'Bold' }}
      >
        {children}
      </Typography>
    </TouchableOpacity>
  );
}