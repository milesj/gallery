import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { graphql, useFragment } from 'react-relay';

import { GalleryBottomSheetModalType } from '~/components/GalleryBottomSheet/GalleryBottomSheetModal';
import { Markdown } from '~/components/Markdown';
import { PostListCaptionFragment$key } from '~/generated/PostListCaptionFragment.graphql';
import { replaceUrlsWithMarkdownFormat } from '~/shared/utils/replaceUrlsWithMarkdownFormat';

import { WarningLinkBottomSheet } from './WarningLinkBottomSheet';

type Props = {
  feedPostRef: PostListCaptionFragment$key;
};

export function PostListCaption({ feedPostRef }: Props) {
  const feedPost = useFragment(
    graphql`
      fragment PostListCaptionFragment on Post {
        __typename
        caption
      }
    `,
    feedPostRef
  );

  const [redirectUrl, setRedirectUrl] = useState('');
  const { caption } = feedPost;

  const captionWithMarkdownLinks = replaceUrlsWithMarkdownFormat(caption ?? '');

  const bottomSheetRef = useRef<GalleryBottomSheetModalType | null>(null);

  const handleLinkPress = useCallback((url: string) => {
    bottomSheetRef.current?.present();
    setRedirectUrl(url);
  }, []);

  return (
    <View className="px-4 pb-4">
      <Markdown onBypassLinkPress={handleLinkPress} style={markdownStyles}>
        {captionWithMarkdownLinks}
      </Markdown>
      <WarningLinkBottomSheet redirectUrl={redirectUrl} ref={bottomSheetRef} />
    </View>
  );
}

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
  },
});
