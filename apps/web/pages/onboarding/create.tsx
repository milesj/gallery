import { useRouter } from 'next/router';
import { useCallback } from 'react';
import styled from 'styled-components';

import { Button } from '~/components/core/Button/Button';
import { VStack } from '~/components/core/Spacer/Stack';
import { BaseM, BaseXL } from '~/components/core/Text/Text';
import FullPageCenteredStep from '~/components/Onboarding/FullPageCenteredStep';
import { OnboardingFooter } from '~/components/Onboarding/OnboardingFooter';
import { useTrack } from '~/contexts/analytics/AnalyticsContext';

export default function CreateFirstCollection() {
  const track = useTrack();

  const { push, query, back } = useRouter();
  const handleNextClick = useCallback(() => {
    track('Start new collection');

    push({
      pathname: '/onboarding/organize-collection',
      query: { ...query },
    });
  }, [push, query, track]);

  return (
    <VStack>
      <FullPageCenteredStep withFooter>
        <VStack gap={24} align="center">
          <VStack gap={8} align="center">
            <BaseXL>Create your first collection</BaseXL>
            <StyledBodyText>
              Organize your gallery with collections. Use them to group pieces by creator, theme, or
              anything that feels right.
            </StyledBodyText>
          </VStack>
          <StyledButton onClick={handleNextClick}>New Collection</StyledButton>
        </VStack>
      </FullPageCenteredStep>

      <OnboardingFooter
        step={'create'}
        onNext={handleNextClick}
        isNextEnabled={true}
        onPrevious={back}
      />
    </VStack>
  );
}

const StyledBodyText = styled(BaseM)`
  max-width: 390px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 200px;
`;