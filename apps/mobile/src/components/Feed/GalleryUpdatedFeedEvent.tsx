import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { GalleryUpdatedFeedEventFragment$key } from '~/generated/GalleryUpdatedFeedEventFragment.graphql';

import { SUPPORTED_FEED_EVENT_TYPES } from './constants';
import { NonRecursiveFeedListItem } from './NonRecursiveFeedListItem';

type GalleryUpdatedFeedEventProps = {
  eventDataRef: GalleryUpdatedFeedEventFragment$key;
};

export function GalleryUpdatedFeedEvent({ eventDataRef }: GalleryUpdatedFeedEventProps) {
  const eventData = useFragment(
    graphql`
      fragment GalleryUpdatedFeedEventFragment on GalleryUpdatedFeedEventData {
        subEventDatas @required(action: THROW) {
          __typename
          ...NonRecursiveFeedListItemFragment
        }
      }
    `,
    eventDataRef
  );

  const subEvents = useMemo(() => {
    return eventData.subEventDatas.filter((subEvent) => {
      return SUPPORTED_FEED_EVENT_TYPES.has(subEvent.__typename);
    });
  }, [eventData.subEventDatas]);

  const { width } = useWindowDimensions();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slides = subEvents?.length ?? 0;
      const totalWidth = width * slides;
      const contentOffset = event.nativeEvent.contentOffset.x;
      const currentSlideIndex = Math.round((contentOffset / totalWidth) * slides);

      setCurrentSlideIndex(currentSlideIndex);
    },
    [subEvents?.length, width]
  );

  const renderItem = useCallback<ListRenderItem<(typeof subEvents)[number]>>(
    ({ item, index }) => {
      return (
        <NonRecursiveFeedListItem
          slideIndex={index}
          eventCount={subEvents.length}
          eventDataRef={item}
        />
      );
    },
    [subEvents.length]
  );

  return (
    <View className="flex flex-col space-y-3">
      {/* We're using a FlatList here instead of a FlashList due to issues */}
      {/* with the FlashList clipping heights of views. Not sure why. */}
      <FlatList
        horizontal
        data={subEvents}
        pagingEnabled
        snapToInterval={width}
        onScroll={handleScroll}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToAlignment="center"
        scrollEventThrottle={200}
        showsHorizontalScrollIndicator={false}
      />

      {subEvents?.length > 1 && (
        <View className="flex w-full flex-row justify-center">
          <View className="flex flex-row space-x-1">
            {subEvents.map((_, index) => {
              return <Circle key={index} active={currentSlideIndex === index} />;
            })}
          </View>
        </View>
      )}
    </View>
  );
}

function Circle({ style, active }: { style?: StyleProp<ViewStyle>; active: boolean }) {
  return (
    <View
      className={`h-1 w-1 rounded-full ${active ? 'bg-offBlack' : 'bg-porcelain'}`}
      style={style}
    />
  );
}