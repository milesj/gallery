import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

import { TrendingSectionFragment$key } from '~/generated/TrendingSectionFragment.graphql';
import { TrendingSectionQueryFragment$key } from '~/generated/TrendingSectionQueryFragment.graphql';

import colors from '../core/colors';
import { VStack } from '../core/Spacer/Stack';
import { TitleDiatypeL } from '../core/Text/Text';
import FeaturedList from './FeaturedList';

type Props = {
  title: string;
  subTitle: string;
  trendingUsersRef: TrendingSectionFragment$key;
  queryRef: TrendingSectionQueryFragment$key;
};

export default function TrendingSection({ trendingUsersRef, queryRef, title, subTitle }: Props) {
  const query = useFragment(
    graphql`
      fragment TrendingSectionQueryFragment on Query {
        ...FeaturedListQueryFragment
      }
    `,
    queryRef
  );

  const trendingUsers = useFragment(
    graphql`
      fragment TrendingSectionFragment on TrendingUsersPayload {
        users {
          ...FeaturedListFragment
        }
      }
    `,
    trendingUsersRef
  );

  return (
    <StyledTrendingSection gap={32}>
      <VStack gap={4}>
        <Title>{title}</Title>
        <TitleDiatypeL color={colors.metal}>{subTitle}</TitleDiatypeL>
      </VStack>
      <FeaturedList featuredUsersRef={trendingUsers.users || []} queryRef={query} />
    </StyledTrendingSection>
  );
}

const StyledTrendingSection = styled(VStack)`
  width: 100%;
`;

const Title = styled(TitleDiatypeL)`
  font-size: 24px;
`;