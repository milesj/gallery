import Link from 'next/link';
import { Route, route } from 'nextjs-routes';
import { useMemo } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import styled from 'styled-components';

import breakpoints from '~/components/core/breakpoints';
import colors from '~/components/core/colors';
import { DisplayLayout } from '~/components/core/enums';
import Markdown from '~/components/core/Markdown/Markdown';
import { HStack, VStack } from '~/components/core/Spacer/Stack';
import { BaseM, TitleM } from '~/components/core/Text/Text';
import { GalleryNameDescriptionHeaderFragment$key } from '~/generated/GalleryNameDescriptionHeaderFragment.graphql';
import { useIsMobileWindowWidth } from '~/hooks/useWindowSize';
import unescape from '~/utils/unescape';

import MobileLayoutToggle from './MobileLayoutToggle';

type Props = {
  galleryRef: GalleryNameDescriptionHeaderFragment$key;
  showMobileLayoutToggle: boolean;
  mobileLayout: DisplayLayout;
  setMobileLayout: (mobileLayout: DisplayLayout) => void;
  noLink?: boolean;
};

function GalleryNameDescriptionHeader({
  galleryRef,
  showMobileLayoutToggle,
  mobileLayout,
  noLink,
  setMobileLayout,
}: Props) {
  const gallery = useFragment(
    graphql`
      fragment GalleryNameDescriptionHeaderFragment on Gallery {
        dbid
        name
        description

        owner @required(action: THROW) {
          username @required(action: THROW)
        }
      }
    `,
    galleryRef
  );

  const isMobile = useIsMobileWindowWidth();

  const username = gallery.owner.username;
  const galleryId = gallery.dbid;

  const unescapedBio = useMemo(
    () => (gallery.description ? unescape(gallery.description) : ''),
    [gallery.description]
  );

  const galleryRoute: Route = {
    pathname: '/[username]/galleries/[galleryId]',
    query: { username, galleryId },
  };

  const galleryName = useMemo(() => {
    if (isMobile) {
      <GalleryNameMobile color={noLink ? colors.offBlack : colors.shadow}>
        {gallery.name}
      </GalleryNameMobile>;
    }

    return (
      <GalleryName color={noLink ? colors.offBlack : colors.shadow}>{gallery.name}</GalleryName>
    );
  }, [gallery.name, isMobile, noLink]);

  return (
    <Container gap={2}>
      <Link href={galleryRoute}>
        {noLink ? galleryName : <GalleryLink href={route(galleryRoute)}>{galleryName}</GalleryLink>}
      </Link>

      <HStack align="flex-start" justify="space-between">
        <HStack align="center" gap={8} grow>
          <StyledUserDetails>
            <StyledBioWrapper>
              <Markdown text={unescapedBio} />
            </StyledBioWrapper>
          </StyledUserDetails>
        </HStack>

        {showMobileLayoutToggle && (
          <StyledButtonsWrapper gap={8} align="center" justify="space-between">
            <MobileLayoutToggle mobileLayout={mobileLayout} setMobileLayout={setMobileLayout} />
          </StyledButtonsWrapper>
        )}
      </HStack>
    </Container>
  );
}

const StyledBioWrapper = styled(BaseM)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: unset;
`;

const GalleryName = styled(TitleM)`
  font-style: normal;
  overflow-wrap: break-word;
`;

const GalleryNameMobile = styled(TitleM)`
  font-style: normal;
  font-size: 18px;
  overflow-wrap: break-word;
`;

const Container = styled(VStack)`
  width: 100%;
`;

const GalleryLink = styled.a`
  all: unset;
  cursor: pointer;
`;

const StyledButtonsWrapper = styled(HStack)`
  height: 36px;
  @media only screen and ${breakpoints.mobile} {
    height: 28px;
  }
`;

const StyledUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  word-break: break-word;

  @media only screen and ${breakpoints.tablet} {
    width: 70%;
  }
`;

export default GalleryNameDescriptionHeader;