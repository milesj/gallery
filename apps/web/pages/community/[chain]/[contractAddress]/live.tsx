import { GetServerSideProps } from 'next';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { NOTES_PER_PAGE } from '~/components/Feed/Socialize/CommentsModal/CommentsModal';
import { Chain } from '~/generated/enums';
import { liveContractAddressByChainQuery } from '~/generated/liveContractAddressByChainQuery.graphql';
import { MetaTagProps } from '~/pages/_app';
import GalleryRedirect from '~/scenes/_Router/GalleryRedirect';
import GalleryRoute from '~/scenes/_Router/GalleryRoute';
import CommunityPagePresentationScene from '~/scenes/CommunityPage/CommunityPagePresentation/CommunityPagePresentationScene';

type CommunityPageProps = MetaTagProps & {
  contractAddress: string;
  chain: Chain;
  projectId: number;
};

export const PROHIBITION_CONTRACT_ADDRESS = '0x47a91457a3a1f700097199fd63c039c4784384ab';
export const RESONANCE_PROJECT_ID = 182;

export default function CommunityLivePage({
  contractAddress,
  chain,
  projectId,
}: CommunityPageProps) {
  // `useLazyLoadQuery` should use a type that's generated by codegen (which is not currently generated)
  const query = useLazyLoadQuery<liveContractAddressByChainQuery>(
    graphql`
      query liveContractAddressByChainQuery(
        $communityAddress: ChainAddressInput!
        $forceRefresh: Boolean
        $communityProjectID: Int!
        $communityPostsFirst: Int!
        $communityPostsAfter: String
        $interactionsFirst: Int!
        $interactionsAfter: String
      ) {
        ...CommunityPagePresentationSceneFragment
      }
    `,
    {
      communityAddress: {
        address: contractAddress,
        chain: chain,
      },
      forceRefresh: false,
      communityPostsFirst: 1,
      interactionsFirst: NOTES_PER_PAGE,
      communityProjectID: projectId,
    }
  );

  if (!contractAddress || contractAddress !== PROHIBITION_CONTRACT_ADDRESS) {
    // Something went horribly wrong
    return <GalleryRedirect to={{ pathname: '/' }} />;
  }

  return (
    <GalleryRoute
      navbar={false}
      element={<CommunityPagePresentationScene queryRef={query} />}
      sidebar={false}
      footer={false}
    />
  );
}

export const getServerSideProps: GetServerSideProps<CommunityPageProps> = async ({ query }) => {
  const contractAddress = query?.contractAddress ? (query.contractAddress as string) : '';
  const chain = query?.chain as Chain;
  const projectId = query?.projectId ? parseInt(query.projectId as string) : RESONANCE_PROJECT_ID;

  return {
    props: {
      contractAddress,
      chain,
      projectId,
    },
  };
};
