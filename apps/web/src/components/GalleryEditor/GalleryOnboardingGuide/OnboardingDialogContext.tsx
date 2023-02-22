import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import { OnboardingDialogContextFragment$key } from '~/generated/OnboardingDialogContextFragment.graphql';
import isMac from '~/utils/isMac';

import useUpdateUserExperience from './useUpdateUserExperience';

type OnboardingDialogContextType = {
  step: number;
  dialogMessage: string;
  nextStep: () => void;
  handleClose: () => void;
};

const OnboardingDialogMessage = {
  1: 'You can modify your gallery name and description here.',
  2: 'You can display multiple collections in a gallery. Name your first collection title here, and add a description.',
  3: 'Search or filter through various chains and wallets to find the pieces you want to curate.',
  4: 'Click a piece to add to your collection.',
  5: 'You can add multiple sections to adjust the number of columns and showcase your pieces in creative ways.',
  // this is set within the render below since its content depends on `window`
  6: '<CLIENT_RENDERED_CONTENT>',
};

export const FINAL_STEP = Object.keys(OnboardingDialogMessage).length;

export const OnboardingDialogContext = createContext<OnboardingDialogContextType | undefined>(
  undefined
);

type OnboardingDialogProviderProps = {
  children: React.ReactNode;
  queryRef: OnboardingDialogContextFragment$key;
};

export function OnboardingDialogProvider({ children, queryRef }: OnboardingDialogProviderProps) {
  const query = useFragment(
    graphql`
      fragment OnboardingDialogContextFragment on Query {
        viewer {
          ... on Viewer {
            __typename
            userExperiences @required(action: THROW) {
              type
              experienced
            }
          }
        }
      }
    `,
    queryRef
  );

  const isUserExperiencedTooltips = useMemo(() => {
    if (query.viewer?.__typename !== 'Viewer') return true;

    return Boolean(
      query.viewer?.userExperiences.find(
        (userExperience) => userExperience.type === 'MultiGalleryAnnouncement'
      )?.experienced
    );
  }, [query.viewer]);

  const [step, setStep] = useState(1);

  const updateUserExperience = useUpdateUserExperience();

  const dialogMessage = useMemo(() => {
    if (step === 6) {
      return `Save your changes at any point (${isMac() ? '⌘' : 'Ctrl'} + S).`;
    }
    return OnboardingDialogMessage[step as keyof typeof OnboardingDialogMessage];
  }, [step]);

  const dismissUserExperience = useCallback(async () => {
    // Trick to dismiss the tooltip immediately while waiting for the mutation to finish
    setStep(0);
    await updateUserExperience({
      type: 'MultiGalleryAnnouncement',
      experienced: true,
    });
  }, [updateUserExperience]);

  const nextStep = useCallback(() => {
    if (step === FINAL_STEP) {
      dismissUserExperience();
      return;
    }

    setStep(step + 1);
  }, [dismissUserExperience, step]);

  const currentStep = useMemo(() => {
    if (isUserExperiencedTooltips) return 0;
    return step;
  }, [isUserExperiencedTooltips, step]);

  const handleClose = useCallback(() => {
    dismissUserExperience();
  }, [dismissUserExperience]);

  const value = useMemo(() => {
    return {
      step: currentStep,
      dialogMessage,
      nextStep,
      handleClose,
    };
  }, [currentStep, dialogMessage, handleClose, nextStep]);

  return (
    <OnboardingDialogContext.Provider value={value}>{children}</OnboardingDialogContext.Provider>
  );
}

export function useOnboardingDialogContext() {
  const value = useContext(OnboardingDialogContext);

  if (!value) {
    throw new Error('Tried to use a OnboardingDialogContext without a provider.');
  }

  return value;
}