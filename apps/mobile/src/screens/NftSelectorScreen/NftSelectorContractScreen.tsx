import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { graphql, useLazyLoadQuery, useRefetchableFragment } from 'react-relay';

import { AnimatedRefreshIcon } from '~/components/AnimatedRefreshIcon';
import { BackButton } from '~/components/BackButton';
import { useSafeAreaPadding } from '~/components/SafeAreaViewWithPadding';
import { Typography } from '~/components/Typography';
import { useSyncTokensActions } from '~/contexts/SyncTokensContext';
import { NftSelectorContractScreenFragment$key } from '~/generated/NftSelectorContractScreenFragment.graphql';
import { NftSelectorContractScreenQuery } from '~/generated/NftSelectorContractScreenQuery.graphql';
import { NftSelectorContractScreenRefetchQuery } from '~/generated/NftSelectorContractScreenRefetchQuery.graphql';
import { MainTabStackNavigatorParamList, MainTabStackNavigatorProp } from '~/navigation/types';
import { NftSelectorPickerSingularAsset } from '~/screens/NftSelectorScreen/NftSelectorPickerSingularAsset';
import { removeNullValues } from '~/shared/relay/removeNullValues';

export function NftSelectorContractScreen() {
  const route = useRoute<RouteProp<MainTabStackNavigatorParamList, 'NftSelectorContractScreen'>>();
  const query = useLazyLoadQuery<NftSelectorContractScreenQuery>(
    graphql`
      query NftSelectorContractScreenQuery {
        ...NftSelectorContractScreenFragment
      }
    `,
    {}
  );

  const [data, refetch] = useRefetchableFragment<
    NftSelectorContractScreenRefetchQuery,
    NftSelectorContractScreenFragment$key
  >(
    graphql`
      fragment NftSelectorContractScreenFragment on Query
      @refetchable(queryName: "NftSelectorContractScreenRefetchQuery") {
        viewer {
          ... on Viewer {
            user {
              tokens {
                dbid
                contract {
                  dbid
                  name
                  contractAddress {
                    address
                  }
                }

                ...NftSelectorPickerSingularAssetFragment
              }
            }
          }
        }
      }
    `,
    query
  );

  const { top } = useSafeAreaPadding();
  const navigation = useNavigation<MainTabStackNavigatorProp>();
  const isFullscreen = route.params.fullScreen;
  const isCreator = route.params.ownerFilter === 'Created';

  const handleSelectNft = useCallback(() => {
    navigation.pop(2);
  }, [navigation]);

  const tokens = useMemo(() => {
    return removeNullValues(
      data.viewer?.user?.tokens?.filter((token) => {
        return token?.contract?.contractAddress?.address === route.params.contractAddress;
      })
    );
  }, [data.viewer?.user?.tokens, route.params.contractAddress]);

  const contractName = tokens[0]?.contract?.name;
  const contractId = tokens[0]?.contract?.dbid ?? '';

  const { isSyncingCreatorTokens, syncCreatedTokensForExistingContract } = useSyncTokensActions();

  const handleSyncTokensForContract = useCallback(async () => {
    syncCreatedTokensForExistingContract(contractId);
  }, [syncCreatedTokensForExistingContract, contractId]);

  const handleRefresh = useCallback(() => {
    refetch({}, { fetchPolicy: 'network-only' });
  }, [refetch]);

  const rows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < tokens.length; i += 3) {
      rows.push(tokens.slice(i, i + 3));
    }
    return rows;
  }, [tokens]);

  const renderItem = useCallback<ListRenderItem<typeof tokens>>(
    ({ item: row }) => {
      return (
        <View className="flex space-x-4 flex-row mb-4 px-4">
          {row.map((token) => {
            return (
              <NftSelectorPickerSingularAsset
                key={token.dbid}
                onSelect={handleSelectNft}
                tokenRef={token}
              />
            );
          })}

          {Array.from({ length: 3 - row.length }).map((_, index) => {
            return <View key={index} className="flex-1 aspect-square" />;
          })}
        </View>
      );
    },
    [handleSelectNft]
  );

  return (
    <View
      className="flex-1 bg-white dark:bg-black-900"
      style={{
        paddingTop: isFullscreen ? top : 16,
      }}
    >
      <View className="flex flex-col space-y-8 flex-1">
        <View className="px-4 relative flex flex-row justify-between items-center">
          <View>
            <BackButton />
          </View>
          <View
            className="absolute inset-0 flex flex-row justify-center items-center"
            pointerEvents="none"
          >
            <Typography
              numberOfLines={1}
              className="text-sm"
              style={{ maxWidth: '65%' }}
              font={{ family: 'ABCDiatype', weight: 'Bold' }}
            >
              {contractName}
            </Typography>
          </View>
          {isCreator ? (
            <View>
              <AnimatedRefreshIcon
                isSyncing={isSyncingCreatorTokens}
                onSync={handleSyncTokensForContract}
                onRefresh={handleRefresh}
                eventElementId="NftSelectorSyncCreatedTokensForExistingContractButton"
                eventName="Nft Selector SyncCreatedTokensForExistingContractButton pressed"
              />
            </View>
          ) : null}
        </View>
        <View className="flex-1 w-full">
          <FlashList renderItem={renderItem} data={rows} estimatedItemSize={100} />
        </View>
      </View>
    </View>
  );
}
