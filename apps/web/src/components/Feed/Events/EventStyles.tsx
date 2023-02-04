import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import colors from '~/components/core/colors';
import { VStack } from '~/components/core/Spacer/Stack';
import { BaseM, BaseS, TitleDiatypeM } from '~/components/core/Text/Text';

type StyledEventProps = {
  children: ReactNode;
  className?: string;
  isSubEvent?: boolean;
  onClick?: JSX.IntrinsicElements['div']['onClick'];
};

export const StyledEvent = ({ children, className, isSubEvent, onClick }: StyledEventProps) => {
  return (
    <StyledInnerEvent onClick={onClick} className={className} isSubEvent={isSubEvent}>
      {children}
    </StyledInnerEvent>
  );
};

export const StyledInnerEvent = styled.div<{ isSubEvent?: boolean }>`
  flex-grow: 1;

  ${({ isSubEvent }) =>
    isSubEvent &&
    css`
      background-color: ${colors.faint};
      border-radius: 4px;
      padding: 10px;
    `}
`;

export const StyledEventHeader = styled.div`
  display: inline;
  width: 100%;

  p {
    display: inline-block;
    line-height: 16px;
  }
`;

export const StyledTime = styled(BaseS)`
  color: ${colors.metal};
  align-self: center;
  display: inline;
  padding-left: 4px;
`;

export const StyledClickHandler = styled.a`
  display: flex;
  flex-direction: column;
  text-decoration: none;
`;

export const StyledEventContent = styled(VStack)<{ hasCaption?: boolean; isSubEvent?: boolean }>`
  background-color: ${({ hasCaption }) => (hasCaption ? colors.faint : 'transparent')};

  padding: ${({ hasCaption, isSubEvent }) => {
    if (isSubEvent) {
      return '16px 0';
    } else if (hasCaption) {
      return '16px';
    } else {
      return '0';
    }
  }};
`;

export const StyledEventLabel = styled(TitleDiatypeM)`
  display: inline-block;
`;

export const StyledEventText = styled(BaseM)<{ isSubEvent?: boolean }>`
  display: contents;

  ${({ isSubEvent }) =>
    isSubEvent &&
    css`
      &:first-letter {
        text-transform: capitalize;
      }
    `}
`;