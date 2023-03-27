import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import { FeedListFragment$data, FeedListFragment$key } from '~/generated/FeedListFragment.graphql';
import { ReportingErrorBoundary } from '~/shared/errors/ReportingErrorBoundary';

import { SUPPORTED_FEED_EVENT_TYPES } from './constants';
import { FeedListCaption } from './FeedListCaption';
import { FeedListItem } from './FeedListItem';
import { FeedListSectionHeader } from './FeedListSectionHeader';

type FeedListProps = {
  feedEventRefs: FeedListFragment$key;
};

type FeedListItem =
  | { kind: 'header'; event: FeedListFragment$data[number] }
  | { kind: 'caption'; event: FeedListFragment$data[number] }
  | { kind: 'event'; event: FeedListFragment$data[number] };

export function FeedList({ feedEventRefs }: FeedListProps) {
  const events = useFragment(
    graphql`
      fragment FeedListFragment on FeedEvent @relay(plural: true) {
        __typename

        dbid
        caption

        eventData @required(action: THROW) {
          ... on GalleryUpdatedFeedEventData {
            __typename
            subEventDatas {
              __typename
            }
          }

          ...FeedListItemFragment
        }

        ...FeedListCaptionFragment
        ...FeedListSectionHeaderFragment
      }
    `,
    feedEventRefs
  );

  const [failedEvents, setFailedEvents] = useState<Set<string>>(new Set());

  const markEventAsFailure = useCallback((eventId: string) => {
    setFailedEvents((previous) => {
      const next = new Set(previous);
      next.add(eventId);
      return next;
    });
  }, []);

  const items = useMemo(() => {
    const items: FeedListItem[] = [];

    for (const event of events) {
      // Make sure this is a supported feed event
      let isSupportedFeedEvent = false;
      if (event.eventData.__typename === 'GalleryUpdatedFeedEventData') {
        isSupportedFeedEvent =
          event.eventData.subEventDatas?.some((subEvent) =>
            SUPPORTED_FEED_EVENT_TYPES.has(subEvent.__typename)
          ) ?? false;
      } else {
        isSupportedFeedEvent = SUPPORTED_FEED_EVENT_TYPES.has(event.eventData.__typename);
      }

      const isAFailedEvent = failedEvents.has(event.dbid);

      if (isSupportedFeedEvent && !isAFailedEvent) {
        items.push({ kind: 'header', event });

        if (event.caption) {
          items.push({ kind: 'caption', event });
        }

        items.push({ kind: 'event', event });
      }
    }

    return items;
  }, [events, failedEvents]);

  const stickyHeaderIndices = useMemo(() => {
    const indices: number[] = [];
    items.forEach((item, index) => {
      if (item.kind === 'header') {
        indices.push(index);
      }
    });

    return indices;
  }, [items]);

  const renderItem = useCallback<ListRenderItem<FeedListItem>>(
    ({ item }) => {
      const markFailure = () => markEventAsFailure(item.event.dbid);

      switch (item.kind) {
        case 'header':
          return (
            <ReportingErrorBoundary fallback={null} onError={markFailure}>
              <FeedListSectionHeader feedEventRef={item.event} />
            </ReportingErrorBoundary>
          );
        case 'caption':
          return (
            <ReportingErrorBoundary fallback={null} onError={markFailure}>
              <FeedListCaption feedEventRef={item.event} />
            </ReportingErrorBoundary>
          );
        case 'event':
          return (
            <ReportingErrorBoundary fallback={null} onError={markFailure}>
              <FeedListItem eventDataRef={item.event.eventData} />
            </ReportingErrorBoundary>
          );
      }
    },
    [markEventAsFailure]
  );

  return (
    <FlashList
      estimatedItemSize={300}
      data={items}
      stickyHeaderIndices={stickyHeaderIndices}
      renderItem={renderItem}
    />
  );
}