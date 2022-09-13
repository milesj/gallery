/**
 * This system is proposed in this doc: https://www.notion.so/gallery-so/Why-the-Spacer-component-is-bad-297ed40731d24b80926659b1cb8fc58d
 *
 * Big credit to SwiftUI for introducing this concept
 *
 * Here is a YouTube video if you want to dive deep into this
 * https://www.youtube.com/watch?v=Mess-OazwTg
 *
 * Here is a blog post explaining why parents should layout children
 * https://dev.to/domagojvidovic/dont-use-margins-for-spacing-between-components-use-gaps-4llc
 */

import styled, { css, CSSProperties } from 'styled-components';

/**
 * Horizontally stacked items with space between them
 */
export const HStack = styled.div<{
  gap?: number;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  grow?: boolean;
  shrink?: boolean;
}>`
  display: flex;
  gap: 0 ${({ gap }) => gap ?? 0}px;

  align-items: ${({ align }) => align ?? 'unset'};
  justify-content: ${({ justify }) => justify ?? 'unset'};

  flex-grow: ${({ grow }) => (grow ? '1' : 'unset')};

  ${({ shrink }) =>
    shrink &&
    css`
      flex-shrink: 1;
      min-width: 0;
    `}
`;

/**
 * Vertically stacked items with space between them
 */
export const VStack = styled.div<{
  gap?: number;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  grow?: boolean;
  shrink?: boolean;
}>`
  display: flex;
  flex-direction: column;

  gap: ${({ gap }) => gap ?? 0}px 0;

  align-items: ${({ align }) => align ?? 'unset'};
  justify-content: ${({ justify }) => justify ?? 'unset'};

  flex-grow: ${({ grow }) => (grow ? '1' : 'unset')};

  ${({ shrink }) =>
    shrink &&
    css`
      flex-shrink: 1;
      min-width: 0;
    `}
`;

/**
 * Fills the remaining space of the flex layout
 */
export const Spacer = styled.div`
  flex-grow: 1;
`;