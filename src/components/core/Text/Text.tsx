import styled from 'styled-components';
import colors from '../colors';

export const Title = styled.p`
  font-family: 'Times New Roman';
  margin: 0;

  font-size: 48px;
`;

type SubtitleProps = {
  color?: colors;
};

export const Subtitle = styled.p<SubtitleProps>`
  font-family: 'Helvetica Neue';
  margin: 0;

  font-size: 20px;
  font-weight: 500;

  color: ${({ color }) => color ?? colors.black};
`;

type TextProps = {
  color?: colors;
  // TODO: make these enums
  lineHeight?: 'normal' | 'tight';
  // TODO: make these enums
  weight?: 'normal' | 'bold';
};

export const Text = styled.p<TextProps>`
  font-family: 'Helvetica Neue';
  margin: 0;

  font-size: 14px;
  line-height: ${({ lineHeight }) =>
    lineHeight === 'tight' ? '16px' : '20px'};
  font-weight: ${({ weight }) => (weight === 'bold' ? 500 : 400)};
  color: ${({ color }) => color ?? colors.black};
`;