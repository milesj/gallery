import { useMemo } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { BaseM } from '~/components/core/Text/Text';
import HoverCardOnUsername from '~/components/HoverCard/HoverCardOnUsername';
import { CollectionLink } from '~/components/Notifications/CollectionLink';
import { SomeoneAdmiredYourFeedEventFragment$key } from '~/generated/SomeoneAdmiredYourFeedEventFragment.graphql';
import { SomeoneAdmiredYourFeedEventQueryFragment$key } from '~/generated/SomeoneAdmiredYourFeedEventQueryFragment.graphql';

type SomeoneAdmiredYourFeedEventProps = {
  notificationRef: SomeoneAdmiredYourFeedEventFragment$key;
  queryRef: SomeoneAdmiredYourFeedEventQueryFragment$key;
};

export function SomeoneAdmiredYourFeedEvent({
  notificationRef,
  queryRef,
}: SomeoneAdmiredYourFeedEventProps) {
  const query = useFragment(
    graphql`
      fragment SomeoneAdmiredYourFeedEventQueryFragment on Query {
        ...HoverCardOnUsernameFollowFragment
      }
    `,
    queryRef
  );

  const notification = useFragment(
    graphql`
      fragment SomeoneAdmiredYourFeedEventFragment on SomeoneAdmiredYourFeedEventNotification {
        count

        feedEvent {
          eventData {
            ... on CollectionCreatedFeedEventData {
              __typename
              collection {
                ...CollectionLinkFragment
              }
            }

            ... on CollectorsNoteAddedToCollectionFeedEventData {
              __typename
              collection {
                ...CollectionLinkFragment
              }
            }

            ... on TokensAddedToCollectionFeedEventData {
              __typename
              collection {
                ...CollectionLinkFragment
              }
            }

            ... on CollectionUpdatedFeedEventData {
              __typename
              collection {
                ...CollectionLinkFragment
              }
            }
          }
        }

        admirers(last: 1) {
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
  const firstAdmirer = notification.admirers?.edges?.[0]?.node;
  const eventType = notification.feedEvent?.eventData?.__typename;

  const verb = useMemo(() => {
    switch (eventType) {
      case 'CollectionCreatedFeedEventData':
      case 'TokensAddedToCollectionFeedEventData':
        return 'admired your additions to';
      case 'CollectorsNoteAddedToCollectionFeedEventData':
        return 'admired your note on';
      case 'CollectionUpdatedFeedEventData':
        return 'admired your updates to';
      default:
        return 'admired your updates to';
    }
  }, [eventType]);

  // @ts-expect-error: property `collection` does not exist on type { readonly __typename: "%other" };
  const collection = notification.feedEvent?.eventData?.collection;

  return (
    <BaseM>
      {count > 1 ? (
        <strong>{notification.count} collectors</strong>
      ) : (
        <>
          {firstAdmirer ? (
            <HoverCardOnUsername userRef={firstAdmirer} queryRef={query} />
          ) : (
            <strong>Someone</strong>
          )}
        </>
      )}
      {` ${verb} `}
      {collection ? <CollectionLink collectionRef={collection} /> : <>your collection</>}
    </BaseM>
  );
}