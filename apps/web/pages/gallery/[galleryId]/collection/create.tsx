import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Route } from 'nextjs-routes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';

import CollectionCreateOrEditForm from '~/components/ManageGallery/OrganizeCollection/CollectionCreateOrEditForm';
import CollectionEditor from '~/components/ManageGallery/OrganizeCollection/Editor/CollectionEditor';
import FullPageStep from '~/components/Onboarding/FullPageStep';
import { useTrack } from '~/contexts/analytics/AnalyticsContext';
import CollectionEditorProvider, {
  useCollectionMetadataState,
  useStagedCollectionState,
} from '~/contexts/collectionEditor/CollectionEditorContext';
import { useReportError } from '~/contexts/errorReporting/ErrorReportingContext';
import { CollectionCreateNavbar } from '~/contexts/globalLayout/GlobalNavbar/CollectionCreateNavbar/CollectionCreateNavbar';
import { useModalActions } from '~/contexts/modal/ModalContext';
import { useCanGoBack } from '~/contexts/navigation/GalleryNavigationProvider';
import { useToastActions } from '~/contexts/toast/ToastContext';
import CollectionWizardContext from '~/contexts/wizard/CollectionWizardContext';
import formatError from '~/errors/formatError';
import { ValidationError } from '~/errors/ValidationError';
import { createCollectionQuery } from '~/generated/createCollectionQuery.graphql';
import useCreateCollection from '~/hooks/api/collections/useCreateCollection';
import GenericActionModal from '~/scenes/Modals/GenericActionModal';
import { getTokenIdsFromCollection } from '~/utils/collectionLayout';

type Props = {
  galleryId: string;
};

function LazyLoadedCollectionEditor({ galleryId }: Props) {
  const query = useLazyLoadQuery<createCollectionQuery>(
    graphql`
      query createCollectionQuery {
        ...CollectionEditorFragment
      }
    `,
    {}
  );

  const track = useTrack();
  const reportError = useReportError();
  const { pushToast } = useToastActions();
  const [generalError, setGeneralError] = useState('');

  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');

  const { showModal } = useModalActions();
  const stagedCollectionState = useStagedCollectionState();
  const collectionMetadata = useCollectionMetadataState();
  const [createCollection] = useCreateCollection();

  const hasShownAddCollectionModal = useRef(false);

  const { push, back, replace } = useRouter();

  const editGalleryUrl = useMemo<Route>(
    () => ({ pathname: '/gallery/[galleryId]/edit', query: { galleryId } }),
    [galleryId]
  );

  const handleNext = useCallback(
    async (caption: string) => {
      track('Save new collection button clicked');

      const title = collectionTitle;
      const description = collectionDescription;

      try {
        track('Create collection', {
          added_name: title.length > 0,
          added_description: description.length > 0,
          nft_ids: getTokenIdsFromCollection(stagedCollectionState),
          caption: caption.length > 0,
        });

        const response = await createCollection({
          galleryId,
          title,
          description,
          stagedCollection: stagedCollectionState,
          tokenSettings: collectionMetadata.tokenSettings,
          caption,
        });

        if (
          response.createCollection?.__typename === 'CreateCollectionPayload' &&
          response.createCollection.collection
        ) {
          push(editGalleryUrl);
          pushToast({
            message: `“${title || 'Collection'}” has been saved`,
          });
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          setGeneralError(error.validationMessage);
        } else if (error instanceof Error) {
          reportError(error);
          setGeneralError(formatError(error));
        }

        reportError('Something unexpected occurred while trying to update a collection', {
          tags: {
            title,
            galleryId,
            description,
          },
        });
      }
    },
    [
      collectionTitle,
      collectionDescription,
      collectionMetadata.tokenSettings,
      createCollection,
      editGalleryUrl,
      galleryId,
      push,
      pushToast,
      reportError,
      stagedCollectionState,
      track,
    ]
  );

  const canGoBack = useCanGoBack();
  const handlePrevious = useCallback(() => {
    showModal({
      content: (
        <GenericActionModal
          buttonText="Leave"
          action={() => {
            if (canGoBack) {
              back();
            } else {
              replace(editGalleryUrl);
            }
          }}
        />
      ),
      headerText: 'Would you like to stop editing?',
    });
  }, [back, canGoBack, editGalleryUrl, replace, showModal]);

  const [isCollectionValid, setIsCollectionValid] = useState(false);

  useEffect(() => {
    if (hasShownAddCollectionModal.current) return;

    showModal({
      content: (
        <CollectionCreateOrEditForm
          onNext={({ title, description }) => {
            setCollectionTitle(title ?? '');
            setCollectionDescription(description ?? '');
          }}
          galleryId={galleryId}
          stagedCollection={stagedCollectionState}
          tokenSettings={collectionMetadata.tokenSettings}
        />
      ),
      headerText: 'Name and describe your collection',
    });

    hasShownAddCollectionModal.current = true;
  }, [showModal, stagedCollectionState, collectionMetadata.tokenSettings, galleryId, push]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <FullPageStep
      withBorder
      navbar={
        <CollectionCreateNavbar
          collectionName={collectionTitle}
          galleryId={galleryId}
          onBack={handlePrevious}
          onNext={handleNext}
          isCollectionValid={isCollectionValid}
          error={generalError}
        />
      }
    >
      <CollectionEditor
        queryRef={query}
        onValidChange={setIsCollectionValid}
        hasUnsavedChanges={hasUnsavedChanges}
        onHasUnsavedChange={setHasUnsavedChanges}
      />
    </FullPageStep>
  );
}

export default function OrganizeCollectionWithProvider({ galleryId }: Props) {
  return (
    <CollectionWizardContext>
      <CollectionEditorProvider>
        <LazyLoadedCollectionEditor galleryId={galleryId} />
      </CollectionEditorProvider>
    </CollectionWizardContext>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (Array.isArray(query.galleryId)) {
    throw new Error('Tried to create a new collection with multiple gallery ids in the url.');
  }

  if (!query.galleryId) {
    throw new Error('Tried to create a new collection without a gallery set.');
  }

  return {
    props: {
      galleryId: query.galleryId,
    },
  };
};