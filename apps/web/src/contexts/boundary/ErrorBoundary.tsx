import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import GalleryLink from '~/components/core/GalleryLink/GalleryLink';
import { VStack } from '~/components/core/Spacer/Stack';
import { BaseM, BaseXL } from '~/components/core/Text/Text';
import {
  ReportingErrorBoundary,
  ReportingErrorBoundaryFallbackProps,
} from '~/contexts/boundary/ReportingErrorBoundary';
import formatError from '~/errors/formatError';

function Fallback({ error }: ReportingErrorBoundaryFallbackProps) {
  const errorMessage = formatError(error);

  return (
    <StyledErrorBoundary gap={16} justify="center" align="center">
      <VStack gap={48}>
        <BaseXL>{errorMessage}</BaseXL>
        <StyledReachOut>
          If you&apos;re continuing to see this error, reach out to us on{' '}
          <GalleryLink href="https://discord.gg/QcJjCDucwK">Discord</GalleryLink>.
        </StyledReachOut>
      </VStack>
    </StyledErrorBoundary>
  );
}

function ErrorBoundary({ children }: PropsWithChildren) {
  return <ReportingErrorBoundary fallback={Fallback}>{children}</ReportingErrorBoundary>;
}

const StyledErrorBoundary = styled(VStack)`
  height: 100vh;
  padding-bottom: 16px;
`;

const StyledReachOut = styled(BaseM)`
  font-style: italic;
`;

export default ErrorBoundary;