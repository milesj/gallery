import { useNavigation } from '@react-navigation/native';
import { ResizeMode } from 'expo-av';
import { useCallback, useMemo, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { graphql, useFragment } from 'react-relay';
import { useTogglePostAdmire } from 'src/hooks/useTogglePostAdmire';

import { UniversalNftPreviewWithBoundary } from '~/components/NftPreview/UniversalNftPreview';
import { PostListItemFragment$key } from '~/generated/PostListItemFragment.graphql';
import { PostListItemQueryFragment$key } from '~/generated/PostListItemQueryFragment.graphql';
import { MainTabStackNavigatorProp } from '~/navigation/types';
import { useGetSinglePreviewImage } from '~/shared/relay/useGetPreviewImages';
import { fitDimensionsToContainerContain } from '~/shared/utils/fitDimensionsToContainer';

import { DOUBLE_TAP_WINDOW } from '../constants';
import { PostCreatorAndCollectionSection } from './PostCreatorAndCollectionSection';

type Props = {
  feedPostRef: PostListItemFragment$key;
  queryRef: PostListItemQueryFragment$key;
};

export function PostListItem({ feedPostRef, queryRef }: Props) {
  const feedPost = useFragment(
    graphql`
      fragment PostListItemFragment on Post {
        __typename

        tokens {
          dbid
          media {
            ... on Media {
              dimensions {
                width
                height
              }
            }
          }
          ...useGetPreviewImagesSingleFragment
          ...UniversalNftPreviewWithBoundaryFragment
          ...PostCreatorAndCollectionSectionFragment
        }

        ...useTogglePostAdmireFragment
      }
    `,
    feedPostRef
  );

  const query = useFragment(
    graphql`
      fragment PostListItemQueryFragment on Query {
        ...useTogglePostAdmireQueryFragment
      }
    `,
    queryRef
  );

  const navigation = useNavigation<MainTabStackNavigatorProp>();
  const dimensions = useWindowDimensions();

  const singleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { hasViewerAdmiredEvent, toggleAdmire } = useTogglePostAdmire({
    postRef: feedPost,
    queryRef: query,
  });

  const firstToken = feedPost.tokens?.[0] || null;

  if (!firstToken) {
    throw new Error('There is no token in post');
  }

  const imageUrl = useGetSinglePreviewImage({
    tokenRef: firstToken,
    preferStillFrameFromGif: true,
    size: 'large',
    // we're simply using the URL for warming the cache;
    // no need to throw an error if image is invalid
    shouldThrow: false,
  });

  const handlePress = useCallback(() => {
    // ChatGPT says 200ms is at the fast end for double tapping.
    // I want the single tap flow to feel fast, so I'm going for speed here.
    // Our users better be nimble af.

    if (singleTapTimeoutRef.current) {
      clearTimeout(singleTapTimeoutRef.current);
      singleTapTimeoutRef.current = null;

      if (!hasViewerAdmiredEvent) {
        toggleAdmire();
      }
    } else {
      singleTapTimeoutRef.current = setTimeout(() => {
        singleTapTimeoutRef.current = null;
        navigation.navigate('UniversalNftDetail', {
          cachedPreviewAssetUrl: imageUrl ?? '',
          tokenId: firstToken.dbid,
        });
      }, DOUBLE_TAP_WINDOW);
    }
  }, [hasViewerAdmiredEvent, toggleAdmire, navigation, imageUrl, firstToken.dbid]);

  const resultDimensions = useMemo(() => {
    const serverSourcedDimensions = firstToken.media?.dimensions;
    if (serverSourcedDimensions?.width && serverSourcedDimensions.height) {
      return fitDimensionsToContainerContain({
        container: { width: dimensions.width, height: dimensions.width },
        source: {
          width: serverSourcedDimensions.width,
          height: serverSourcedDimensions.height,
        },
      });
    }

    return {
      height: dimensions.width,
      width: dimensions.width,
    };
  }, [firstToken.media?.dimensions, dimensions.width]);

  return (
    <View className="flex flex-1 flex-col pt-1" style={{ width: dimensions.width }}>
      <View
        style={{
          height: resultDimensions.height,
          width: dimensions.width,
        }}
      >
        <UniversalNftPreviewWithBoundary
          tokenRef={firstToken}
          onPress={handlePress}
          resizeMode={ResizeMode.CONTAIN}
          priority={FastImage.priority.high}
          size="large"
        />
      </View>
      <PostCreatorAndCollectionSection tokenRef={firstToken} />
    </View>
  );
}
