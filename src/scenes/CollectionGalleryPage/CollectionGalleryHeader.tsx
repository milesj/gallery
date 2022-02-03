import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import unescape from 'lodash.unescape';
import { Subdisplay, BodyRegular } from 'components/core/Text/Text';
import Spacer from 'components/core/Spacer/Spacer';
import colors from 'components/core/colors';
import Markdown from 'components/core/Markdown/Markdown';
import NavElement from 'components/core/Page/GlobalNavbar/NavElement';
import TextButton from 'components/core/Button/TextButton';
import breakpoints, { size } from 'components/core/breakpoints';
import CopyToClipboard from 'components/CopyToClipboard/CopyToClipboard';
import { Collection } from 'types/Collection';
import { useRouter } from 'next/router';
import { useModal } from 'contexts/modal/ModalContext';
import CollectionCreateOrEditForm from 'flows/shared/steps/OrganizeCollection/CollectionCreateOrEditForm';
import noop from 'utils/noop';
import Mixpanel from 'utils/mixpanel';
import { usePossiblyAuthenticatedUser } from 'hooks/api/users/useUser';
import MobileLayoutToggle from 'scenes/UserGalleryPage/MobileLayoutToggle';
import { useBreakpoint } from 'hooks/useWindowSize';
import { DisplayLayout } from 'components/core/enums';
import useBackButton from 'hooks/useBackButton';

type Props = {
  collection: Collection;
  mobileLayout: DisplayLayout;
  setMobileLayout: (mobileLayout: DisplayLayout) => void;
};

function CollectionGalleryHeader({ collection, mobileLayout, setMobileLayout }: Props) {
  const { showModal } = useModal();
  const { push } = useRouter();
  const screenWidth = useBreakpoint();
  const user = usePossiblyAuthenticatedUser();
  const username = useMemo(() => window.location.pathname.split('/')[1], []);
  const handleBackClick = useBackButton({ username });

  const unescapedCollectionName = useMemo(() => unescape(collection.name), [collection.name]);
  const unescapedCollectorsNote = useMemo(() => unescape(collection.collectors_note || ''), [
    collection.collectors_note,
  ]);

  const authenticatedUserIsOnTheirOwnPage = username.toLowerCase() === user?.username.toLowerCase();

  const collectionUrl = window.location.href;

  const isMobileScreen = screenWidth === size.mobile && collection && collection.nfts?.length > 0;

  const handleEditCollectionClick = useCallback(() => {
    Mixpanel.track('Update existing collection');
    void push(`/edit?collectionId=${collection.id}`);
  }, [collection.id]);

  const handleEditNameClick = useCallback(() => {
    showModal(
      <CollectionCreateOrEditForm
        // No need for onNext because this isn't part of a wizard
        onNext={noop}
        collectionId={collection.id}
        collectionName={collection.name}
        collectionCollectorsNote={collection.collectors_note}
      />
    );
  }, [collection.collectors_note, collection.id, collection.name, showModal]);

  return (
    <StyledCollectionGalleryHeaderWrapper>
      <StyledHeaderWrapper>
        <StyledUsernameWrapper>
          <StyledUsername onClick={handleBackClick}>
            {username}
            {collection.name && <StyledSeparator>/</StyledSeparator>}
          </StyledUsername>
          {isMobileScreen && (
            <MobileLayoutToggle mobileLayout={mobileLayout} setMobileLayout={setMobileLayout} />
          )}
        </StyledUsernameWrapper>
        {unescapedCollectionName}
      </StyledHeaderWrapper>
      <Spacer height={8} />
      <StyledCollectionNote color={colors.gray50}>
        <Markdown text={unescapedCollectorsNote} />
      </StyledCollectionNote>
      <Spacer height={60} />
      <StyledCollectionActions>
        {authenticatedUserIsOnTheirOwnPage && (
          <>
            <TextButton onClick={handleEditNameClick} text="EDIT NAME & DESCRIPTION" />
            {!isMobileScreen && (
              <>
                <Spacer width={12} />
                <NavElement>
                  <TextButton onClick={handleEditCollectionClick} text="Edit Collection" />
                </NavElement>
              </>
            )}
            <Spacer width={12} />
          </>
        )}
        <CopyToClipboard textToCopy={collectionUrl}>
          <TextButton text="Share" />
        </CopyToClipboard>
      </StyledCollectionActions>
    </StyledCollectionGalleryHeaderWrapper>
  );
}

const StyledCollectionGalleryHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const StyledHeaderWrapper = styled(Subdisplay)`
  display: flex;
  flex-direction: column;
  @media only screen and ${breakpoints.tablet} {
    flex-direction: row;
  }
`;

const StyledUsernameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledSeparator = styled.div`
  margin: 0 10px;
  display: none;

  @media only screen and ${breakpoints.mobileLarge} {
    display: block;
  }
`;

const StyledUsername = styled.span`
  cursor: pointer;
  color: ${colors.gray40};
  display: flex;
  &:hover {
    color: ${colors.gray80};
  }
`;

const StyledCollectionNote = styled(BodyRegular)`
  word-break: break-word;
  /* ensures linebreaks are reflected in UI */
  white-space: pre-line;
`;

const StyledCollectionActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;

  @media only screen and ${breakpoints.tablet} {
    width: auto;
  }
`;

export default CollectionGalleryHeader;