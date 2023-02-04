import { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import { Chain } from '~/components/ManageGallery/OrganizeCollection/Sidebar/chains';
import {
  createVirtualizedRowsFromGroups,
  createVirtualizedRowsFromTokens,
} from '~/components/ManageGallery/OrganizeCollection/Sidebar/createVirtualizedRowsFromGroups';
import { EmptySidebar } from '~/components/ManageGallery/OrganizeCollection/Sidebar/EmptySidebar';
import { groupCollectionsByAddress } from '~/components/ManageGallery/OrganizeCollection/Sidebar/groupCollectionsByAddress';
import { SidebarList } from '~/components/ManageGallery/OrganizeCollection/Sidebar/SidebarList';
import { EditModeToken } from '~/components/ManageGallery/OrganizeCollection/types';
import { SidebarTokensFragment$key } from '~/generated/SidebarTokensFragment.graphql';
import useSetSpamPreference from '~/hooks/api/tokens/useSetSpamPreference';

import { SidebarView } from './SidebarViewSelector';

type SidebarTokensProps = {
  isSearching: boolean;
  selectedChain: Chain;
  selectedView: SidebarView;
  editModeTokens: EditModeToken[];
  tokenRefs: SidebarTokensFragment$key;
};

export const SidebarTokens = ({
  tokenRefs,
  isSearching,
  selectedChain,
  selectedView,
  editModeTokens,
}: SidebarTokensProps) => {
  const tokens = useFragment(
    graphql`
      fragment SidebarTokensFragment on Token @relay(plural: true) {
        id
        dbid

        # Escape hatch for data processing in util files
        # eslint-disable-next-line relay/unused-fields
        chain

        contract {
          # Escape hatch for data processing in util files
          # eslint-disable-next-line relay/unused-fields
          name

          contractAddress {
            address
          }
        }

        ...SidebarListTokenFragment
      }
    `,
    tokenRefs
  );

  const setSpamPreference = useSetSpamPreference();
  const setSpamPreferenceForCollection = useCallback(
    (address: string, isSpam: boolean) => {
      const filteredTokens = tokens
        .filter((token) => token.contract?.contractAddress?.address === address)
        .map(({ id, dbid }) => ({ id, dbid }));

      if (filteredTokens.length === 0) {
        throw new Error(
          `No matching token IDs found for ${address} to mark as ${isSpam ? 'spam' : 'not spam'}`
        );
      }

      setSpamPreference({ tokens: filteredTokens, isSpam });
    },
    [tokens, setSpamPreference]
  );

  const [, setErroredTokenIds] = useState<Set<string>>(new Set());
  const [collapsedCollections, setCollapsedCollections] = useState<Set<string>>(new Set());

  const handleMarkErroredTokenId = useCallback((id: string) => {
    setErroredTokenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleMarkSuccessTokenId = useCallback((id: string) => {
    setErroredTokenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleToggleExpanded = useCallback((address: string) => {
    setCollapsedCollections((previous) => {
      const next = new Set(previous);

      if (next.has(address)) {
        next.delete(address);
      } else {
        next.add(address);
      }

      return next;
    });
  }, []);

  let shouldUseCollectionGrouping: boolean;
  if (isSearching) {
    shouldUseCollectionGrouping = true;
  } else {
    shouldUseCollectionGrouping = selectedChain !== 'POAP';
  }

  const rows = useMemo(() => {
    if (shouldUseCollectionGrouping) {
      const groups = groupCollectionsByAddress({ tokens, editModeTokens });

      return createVirtualizedRowsFromGroups({ groups, collapsedCollections });
    } else {
      return createVirtualizedRowsFromTokens({
        tokens,
        editModeTokens,
      });
    }
  }, [collapsedCollections, editModeTokens, shouldUseCollectionGrouping, tokens]);

  useEffect(
    function resetCollapsedSectionsWhileSearching() {
      if (isSearching) {
        setCollapsedCollections(new Set());
      }
    },
    [isSearching]
  );

  if (rows.length === 0) {
    return (
      <EmptySidebar
        reason={isSearching ? 'no-search-results' : 'no-nfts'}
        chain={selectedChain}
        view={selectedView}
      />
    );
  }

  return (
    <SidebarList
      rows={rows}
      selectedView={selectedView}
      onToggleExpanded={handleToggleExpanded}
      handleTokenRenderError={handleMarkErroredTokenId}
      handleTokenRenderSuccess={handleMarkSuccessTokenId}
      shouldUseCollectionGrouping={shouldUseCollectionGrouping}
      setSpamPreferenceForCollection={setSpamPreferenceForCollection}
    />
  );
};