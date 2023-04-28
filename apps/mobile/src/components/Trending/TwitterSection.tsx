import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { graphql, useFragment } from 'react-relay';

import { TwitterSectionQueryFragment$key } from '~/generated/TwitterSectionQueryFragment.graphql';
import { RootStackNavigatorProp } from '~/navigation/types';

import { Typography } from '../Typography';
import { TrendingUserList } from './TrendingUserList';
import { TwitterIcon } from './TwitterIcon';

type Props = {
  title: string;
  description: string;
  queryRef: TwitterSectionQueryFragment$key;
};

export function TwitterSection({ title, description, queryRef }: Props) {
  const query = useFragment(
    graphql`
      fragment TwitterSectionQueryFragment on Query {
        socialConnections(
          after: $twitterListAfter
          first: $twitterListFirst
          socialAccountType: Twitter
          excludeAlreadyFollowing: false
        ) {
          edges {
            node {
              __typename
              ... on SocialConnection {
                __typename
                galleryUser {
                  ... on GalleryUser {
                    __typename
                    ...TrendingUserListFragment
                  }
                }
              }
            }
          }
        }

        ...TrendingUserListQueryFragment
      }
    `,
    queryRef
  );

  const navigation = useNavigation<RootStackNavigatorProp>();

  const handleSeeAll = useCallback(() => {
    navigation.navigate('TwitterSuggestionList');
  }, [navigation]);

  const nonNullUsers = useMemo(() => {
    const users = [];

    for (const edge of query.socialConnections?.edges ?? []) {
      if (edge?.node?.__typename === 'SocialConnection' && edge?.node?.galleryUser) {
        users.push(edge.node.galleryUser);
      }
    }

    return users;
  }, [query.socialConnections?.edges]);

  return (
    <View className="flex-1 px-3">
      <View className="flex flex-row items-end justify-between py-3">
        <View>
          <View className="flex flex-row items-center space-x-1">
            <TwitterIcon />
            <Typography
              font={{
                family: 'ABCDiatype',
                weight: 'Bold',
              }}
              className="text-lg text-black dark:text-white"
            >
              {title}
            </Typography>
          </View>
          <Typography
            font={{
              family: 'ABCDiatype',
              weight: 'Bold',
            }}
            className="text-metal text-sm"
          >
            {description}
          </Typography>
        </View>
        <TouchableOpacity onPress={handleSeeAll}>
          <Typography
            font={{
              family: 'ABCDiatype',
              weight: 'Regular',
            }}
            className="text-shadow text-sm"
          >
            See all
          </Typography>
        </TouchableOpacity>
      </View>

      <TrendingUserList usersRef={nonNullUsers} queryRef={query} />
    </View>
  );
}