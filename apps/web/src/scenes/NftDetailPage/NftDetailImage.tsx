import { useMemo } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { size } from '~/components/core/breakpoints';
import ImageWithLoading from '~/components/LoadingAsset/ImageWithLoading';
import { CouldNotRenderNftError } from '~/errors/CouldNotRenderNftError';
import { NftDetailImageFragment$key } from '~/generated/NftDetailImageFragment.graphql';
import { useThrowOnMediaFailure } from '~/hooks/useNftRetry';
import { useBreakpoint } from '~/hooks/useWindowSize';
import isVideoUrl from '~/utils/isVideoUrl';
import noop from '~/utils/noop';
import { graphqlGetResizedNftImageUrlWithFallback } from '~/utils/token';

import { StyledVideo } from './NftDetailVideo';

type Props = {
  tokenRef: NftDetailImageFragment$key;
  onClick?: () => void;
  onLoad: () => void;
};

function NftDetailImage({ tokenRef, onClick = noop, onLoad }: Props) {
  const token = useFragment(
    graphql`
      fragment NftDetailImageFragment on Token {
        name
        media @required(action: THROW) {
          ... on ImageMedia {
            __typename
            contentRenderURL
          }
        }
      }
    `,
    tokenRef
  );
  const breakpoint = useBreakpoint();
  const { handleError } = useThrowOnMediaFailure('NftDetailImage');

  const contentRenderURL = useMemo(() => {
    if (token.media.__typename === 'ImageMedia') {
      return token.media.contentRenderURL;
    }

    return '';
  }, [token.media]);

  const resizedImage = graphqlGetResizedNftImageUrlWithFallback(contentRenderURL, 1200);

  if (!resizedImage) {
    throw new CouldNotRenderNftError('NftDetailImage', 'resizedImage could not be computed', {
      contentRenderURL,
    });
  }

  const { url } = resizedImage;

  // TODO: this is a hack to handle videos that are returned by OS as images.
  // i.e., assets that do not have animation_urls, and whose image_urls all contain
  // links to videos. we should be able to remove this hack once we're off of OS.
  if (isVideoUrl(url)) {
    return (
      <StyledVideo
        onLoadedData={onLoad}
        onError={handleError}
        src={url}
        muted
        autoPlay
        loop
        playsInline
        controls
      />
    );
  }

  return (
    <ImageWithLoading
      src={url}
      alt={token.name ?? ''}
      heightType={breakpoint === size.desktop ? 'maxHeightMinScreen' : undefined}
      onClick={onClick}
      onLoad={onLoad}
    />
  );
}

export default NftDetailImage;