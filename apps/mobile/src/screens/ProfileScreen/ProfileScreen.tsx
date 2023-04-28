import { RouteProp, useRoute } from '@react-navigation/native';
import { Suspense, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { ProfileView } from '~/components/ProfileView/ProfileView';
import { ProfileViewFallback } from '~/components/ProfileView/ProfileViewFallback';
import { Typography } from '~/components/Typography';
import { ProfileScreenQuery } from '~/generated/ProfileScreenQuery.graphql';
import { RootStackNavigatorParamList } from '~/navigation/types';

function ProfileScreenInner() {
  const route = useRoute<RouteProp<RootStackNavigatorParamList, 'Profile'>>();

  const query = useLazyLoadQuery<ProfileScreenQuery>(
    graphql`
      query ProfileScreenQuery($username: String!, $feedLast: Int!, $feedBefore: String) {
        userByUsername(username: $username) {
          ... on GalleryUser {
            ...ProfileViewFragment
          }

          ... on ErrUserNotFound {
            __typename
          }

          ... on Error {
            __typename
          }
        }

        ...ProfileViewQueryFragment
      }
    `,
    { username: route.params.username, feedLast: 24 }
  );

  const inner = useMemo(() => {
    if (query.userByUsername?.__typename === 'GalleryUser') {
      return <ProfileView queryRef={query} userRef={query.userByUsername} />;
    } else {
      return <Typography font={{ family: 'ABCDiatype', weight: 'Regular' }}>Not found</Typography>;
    }
  }, [query]);

  return inner;
}

export function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Suspense fallback={<ProfileViewFallback />}>
        <ProfileScreenInner />
      </Suspense>
    </SafeAreaView>
  );
}