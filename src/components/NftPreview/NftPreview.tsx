import styled from 'styled-components';
import { Nft } from 'types/Nft';

import breakpoints from 'components/core/breakpoints';

const IMG_FALLBACK_URL = 'https://i.ibb.co/q7DP0Dz/no-image.png';

function resize(imgUrl: string, width: number) {
  if (!imgUrl) return null;
  return imgUrl.replace('=s250', `=s${width}`);
}

type Props = {
  nft: Nft;
};

function NftPreview({ nft }: Props) {
  const imgUrl =
    resize(nft.image_preview_url, 275) || nft.image_url || IMG_FALLBACK_URL;

  return (
    <StyledNftPreview key={nft.id}>
      <StyledNft src={imgUrl} alt={nft.name} />
    </StyledNftPreview>
  );
}

const StyledNftPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NFT_PREVIEW_WIDTH = {
  mobile: '288px',
  tablet: '176px',
  desktop: '288px',
};

const StyledNft = styled.img`
  @media only screen and ${breakpoints.mobile} {
    width: ${NFT_PREVIEW_WIDTH.mobile};
  }
  @media only screen and ${breakpoints.tablet} {
    width: ${NFT_PREVIEW_WIDTH.tablet};
  }
  @media only screen and ${breakpoints.desktop} {
    width: ${NFT_PREVIEW_WIDTH.desktop};
  }
`;

export default NftPreview;