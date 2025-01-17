import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

import CommunityHoverCard from '~/components/HoverCard/CommunityHoverCard';
import UserHoverCard from '~/components/HoverCard/UserHoverCard';
import { GalleryTextElementParserMentionsFragment$data } from '~/generated/GalleryTextElementParserMentionsFragment.graphql';
import { MentionComponentFragment$key } from '~/generated/MentionComponentFragment.graphql';

type Props = {
  mention: string;
  mentionData: GalleryTextElementParserMentionsFragment$data['entity'];
  mentionsRef: MentionComponentFragment$key;
};

export function MentionComponent({ mention, mentionData, mentionsRef }: Props) {
  const query = useFragment(
    graphql`
      fragment MentionComponentFragment on Mention @relay(plural: true) {
        __typename
        ...GalleryTextElementParserMentionsFragment
        entity {
          __typename
          ... on GalleryUser {
            __typename
            username
            ...UserHoverCardFragment
          }
          ... on Community {
            __typename
            name
            contractAddress {
              address
            }
            ...CommunityHoverCardFragment
          }
        }
      }
    `,
    mentionsRef
  );

  if (!mentionData) return null;

  if (mentionData.__typename === 'GalleryUser' && mentionData.username) {
    const user = query.find(
      (mention) =>
        mention.entity?.__typename === 'GalleryUser' &&
        mention.entity.username === mentionData.username
    )?.entity;

    if (user?.__typename !== 'GalleryUser') return null;

    return (
      <UserHoverCard userRef={user}>
        <StyledMentionText as="span">{mention}</StyledMentionText>
      </UserHoverCard>
    );
  }

  if (mentionData.__typename === 'Community') {
    const community = query.find(
      (mention) =>
        mention.entity?.__typename === 'Community' &&
        mention.entity.contractAddress?.address === mentionData.contractAddress?.address
    )?.entity;

    if (community?.__typename !== 'Community') return null;

    return (
      <CommunityHoverCard communityRef={community} communityName={community.name ?? ''}>
        <StyledMentionText as="span">{mention}</StyledMentionText>
      </CommunityHoverCard>
    );
  }

  return <StyledMentionText>{mention}</StyledMentionText>;
}

const StyledMentionText = styled.span``;
