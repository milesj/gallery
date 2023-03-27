import { useMemo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { CollectionUpdatedFeedEventFragment$key } from '~/generated/CollectionUpdatedFeedEventFragment.graphql';
import { removeNullValues } from '~/shared/relay/removeNullValues';

import { Typography } from '../Typography';
import { EventTokenGrid } from './EventTokenGrid';
import { FeedEventCarouselCellHeader } from './FeedEventCarouselCellHeader';
import { FeedListCollectorsNote } from './FeedListCollectorsNote';

type CollectionUpdatedFeedEventProps = {
  isFirstSlide: boolean;
  allowPreserveAspectRatio: boolean;
  collectionUpdatedFeedEventDataRef: CollectionUpdatedFeedEventFragment$key;
};

export function CollectionUpdatedFeedEvent({
  isFirstSlide,
  allowPreserveAspectRatio,
  collectionUpdatedFeedEventDataRef,
}: CollectionUpdatedFeedEventProps) {
  const eventData = useFragment(
    graphql`
      fragment CollectionUpdatedFeedEventFragment on CollectionUpdatedFeedEventData {
        newCollectorsNote

        collection {
          name
        }

        newTokens {
          token {
            ...EventTokenGridFragment
          }
        }
      }
    `,
    collectionUpdatedFeedEventDataRef
  );

  const tokens = useMemo(() => {
    return removeNullValues(eventData.newTokens?.map((collectionToken) => collectionToken?.token));
  }, [eventData.newTokens]);

  return (
    <View className="flex flex-col">
      <FeedEventCarouselCellHeader>
        <Typography className="text-xs" font={{ family: 'ABCDiatype', weight: 'Regular' }}>
          Made a change to
        </Typography>

        <Typography className="text-xs" font={{ family: 'ABCDiatype', weight: 'Bold' }}>
          {eventData.collection?.name ?? 'Untitled'}
        </Typography>
      </FeedEventCarouselCellHeader>

      {eventData.newCollectorsNote && (
        <FeedListCollectorsNote collectorsNote={eventData.newCollectorsNote} />
      )}

      <EventTokenGrid
        imagePriority={isFirstSlide ? FastImage.priority.high : FastImage.priority.normal}
        allowPreserveAspectRatio={allowPreserveAspectRatio}
        tokenRefs={tokens}
      />
    </View>
  );
}