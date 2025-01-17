import { graphql, readInlineData } from 'relay-runtime';

import { extractRelevantMetadataFromCommunityFragment$key } from '~/generated/extractRelevantMetadataFromCommunityFragment.graphql';

import { isChainEvm } from './chains';
import { getOpenseaExternalUrlDangerouslyForCollection } from './getOpenseaExternalUrl';
import { getObjktExternalUrlDangerouslyForCollection } from './getTezosExternalUrl';
import { getExternalAddressLink } from './wallet';

export function extractRelevantMetadataFromCommunity(
  communityRef: extractRelevantMetadataFromCommunityFragment$key
) {
  const community = readInlineData(
    graphql`
      fragment extractRelevantMetadataFromCommunityFragment on Community @inline {
        chain
        contract {
          contractAddress {
            address
            ...walletGetExternalAddressLinkFragment
          }
        }
      }
    `,
    communityRef
  );

  const { contract, chain } = community;

  const contractAddress = contract?.contractAddress?.address;
  const result = {
    contractAddress,
    openseaUrl: '',
    objktUrl: '',
    externalAddressUrl: '',
  };

  if (contractAddress) {
    if (chain === 'Tezos') {
      result.objktUrl = getObjktExternalUrlDangerouslyForCollection(contractAddress);
    }

    result.externalAddressUrl = getExternalAddressLink(contract?.contractAddress) ?? '';
    if (
      chain &&
      // eslint-disable-next-line relay/no-future-added-value
      chain !== '%future added value' &&
      isChainEvm(chain)
    ) {
      result.openseaUrl = getOpenseaExternalUrlDangerouslyForCollection(chain, contractAddress);
    }
  }

  return result;
}
