import { Text, TextProps } from 'react-native';
import { graphql, useFragment } from 'react-relay';

import { ProcessedTextFragment$key } from '~/generated/ProcessedTextFragment.graphql';
import GalleryProcessedText from '~/shared/components/GalleryProccessedText/GalleryProcessedText';
import { MentionDataType } from '~/shared/hooks/useMentionableMessage';

import { LinkComponent } from './elements/LinkComponent';
import { MentionComponent } from './elements/MentionComponent';
import { TextComponent } from './elements/TextComponent';

type ProcessedTextProps = {
  text: string;
  mentionsRef?: ProcessedTextFragment$key;
  mentionsInText?: MentionDataType[];
} & TextProps;

export default function ProcessedText({
  text,
  mentionsRef = [],
  mentionsInText,
  ...props
}: ProcessedTextProps) {
  const mentions = useFragment(
    graphql`
      fragment ProcessedTextFragment on Mention @relay(plural: true) {
        __typename
        ...GalleryProcessedTextFragment
      }
    `,
    mentionsRef
  );

  return (
    <GalleryProcessedText
      text={text}
      mentionsRef={mentions}
      TextComponent={TextComponent}
      LinkComponent={LinkComponent}
      MentionComponent={MentionComponent}
      BreakComponent={() => <Text>{'\n'}</Text>}
      mentionsInText={mentionsInText}
      {...props}
    />
  );
}
