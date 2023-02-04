/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  memo,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFragment, useLazyLoadQuery } from 'react-relay';
import { fetchQuery, graphql } from 'relay-runtime';
import styled from 'styled-components';

import { FADE_TRANSITION_TIME_MS } from '~/components/FadeTransitioner/FadeTransitioner';
import { MAINTENANCE_BANNER_6_18_STORAGE_KEY } from '~/constants/storageKeys';
import { useGlobalNavbarHeight } from '~/contexts/globalLayout/GlobalNavbar/useGlobalNavbarHeight';
import { GlobalLayoutContextNavbarFragment$key } from '~/generated/GlobalLayoutContextNavbarFragment.graphql';
import { GlobalLayoutContextQuery } from '~/generated/GlobalLayoutContextQuery.graphql';
import useDebounce from '~/hooks/useDebounce';
import usePrevious from '~/hooks/usePrevious';
import useThrottle from '~/hooks/useThrottle';
import { PreloadQueryArgs } from '~/types/PageComponentPreloadQuery';
import isTouchscreenDevice from '~/utils/isTouchscreenDevice';

import { FEATURED_COLLECTION_IDS } from './GlobalAnnouncementPopover/GlobalAnnouncementPopover';
import useGlobalAnnouncementPopover from './GlobalAnnouncementPopover/useGlobalAnnouncementPopover';
import Banner from './GlobalBanner/GlobalBanner';
import GlobalNavbar, { Props as GlobalNavbarProps } from './GlobalNavbar/GlobalNavbar';

type GlobalLayoutState = {
  isNavbarVisible: boolean;
  wasNavbarVisible: boolean;
  isPageInSuspenseRef: MutableRefObject<boolean>;
};

export const GlobalLayoutStateContext = createContext<GlobalLayoutState | undefined>(undefined);

export const useGlobalLayoutState = (): GlobalLayoutState => {
  const context = useContext(GlobalLayoutStateContext);
  if (!context) {
    throw new Error('Attempted to use GlobalLayoutStateContext without a provider!');
  }

  return context;
};

type GlobalLayoutActions = {
  setBannerVisible: (b: boolean) => void;
  setNavbarVisible: (b: boolean) => void;
  setIsPageInSuspenseState: (b: boolean) => void;
  setContent: (e: ReactElement | null) => void;
};

const GlobalLayoutActionsContext = createContext<GlobalLayoutActions | undefined>(undefined);

export const useGlobalLayoutActions = (): GlobalLayoutActions => {
  const context = useContext(GlobalLayoutActionsContext);
  if (!context) {
    throw new Error('Attempted to use GlobalLayoutActionsContext without a provider!');
  }

  return context;
};

type Props = { children: ReactNode };

// the action that triggered the fade animation
type FadeTriggerType = 'route' | 'scroll' | 'hover';

const GlobalLayoutContextQueryNode = graphql`
  query GlobalLayoutContextQuery($collectionIds: [DBID!]!) {
    ...GlobalLayoutContextNavbarFragment
    # Keeping this around for the next time we want to use it
    ...useGlobalAnnouncementPopoverFragment
  }
`;

const GlobalLayoutContextProvider = memo(({ children }: Props) => {
  const query = useLazyLoadQuery<GlobalLayoutContextQuery>(GlobalLayoutContextQueryNode, {
    collectionIds: FEATURED_COLLECTION_IDS,
  });

  // whether the global banner is visible
  const [isBannerVisible, setBannerVisible] = useState(false);

  const navbarHeight = useGlobalNavbarHeight();

  /**
   * the action that triggered the fade animation.
   *
   * there are 3 types of triggers:
   * - route-based setting determined by `GalleryRoute.tsx`
   * - scroll-based setting determined by scroll position
   * - hover-based setting determined by mouse position
   */
  const [fadeType, setFadeType] = useState<FadeTriggerType>('route');

  /**
   * we track whether the child route is in suspense in both React State and Ref:
   * - `state` is used to determine whether we should debounce or throttle nav animation
   * - `ref` is used to stabilizing callbacks that areused for scroll, hover handling
   *
   * why do we care if the app is in suspense?
   * - it allows us to disable visibility of the navbar against the loading fallback
   *
   * can't we just address the above with z-index?
   * - no, because when both the loading fallback and the navbar have between 0~1 opacity,
   *   both elements are displayed on the screen.
   */
  const [isPageInSuspenseState, setIsPageInSuspenseState] = useState(false);
  const isPageInSuspenseRef = useRef(false);

  /**
   * navbar-related states.
   *
   * - `isNavbarEnabled` is the raw state that's set by "dumb" components / interactions
   *   that simply wanna display / hide the nav, according to its internal logic
   * - we then need to `debounce` or `throttle` this state because many interactions could be
   *   fighting to set this state
   * - the difference between debouncing vs. throttling comes down to whether we need to
   *   delay the navbar fade animation vs. display it immediately, respectively.
   * - `wasNavbarVisible` is used to determine whether we should continue displaying the navbar
   *   across transitions. for example, if the user navigates from /a => /b and the navbar
   *   is visible in both scenarios, we should keep it in view, without any fade animations.
   */
  const [isNavbarEnabled, setIsNavbarEnabled] = useState(false);
  const debounced = useDebounce(isNavbarEnabled, FADE_TRANSITION_TIME_MS);
  const throttled = useThrottle(isNavbarEnabled, FADE_TRANSITION_TIME_MS);

  const isNavbarVisible = useMemo(() => {
    if (isPageInSuspenseState && isNavbarEnabled) {
      return debounced;
    }
    return throttled;
  }, [isNavbarEnabled, isPageInSuspenseState, throttled, debounced]);
  const wasNavbarVisible = usePrevious(isNavbarVisible) ?? false;

  // whether the route wants the navbar disabled. this is an override where scrolling / hovering
  // will not make the navbar appear
  const forcedHiddenByRouteRef = useRef(false);

  // touchscreen devices will have different behavior
  const isTouchscreen = useRef(isTouchscreenDevice());

  /**
   * There is a race condition that arises if a scroll-based fade is triggered immediately after
   * a route-based fade, causing the nav to appear prematurely. We use a timestamp to determine
   * whether an animation was recently triggered by route change. (For some reason, this bug
   * couldn't be fixed with throttling)
   */
  const lastFadeTriggeredByRouteTimestampRef = useRef(0);

  //-------------- ROUTE ---------------
  const handleFadeNavbarFromGalleryRoute = useCallback(
    (visible: boolean) => {
      setFadeType('route');
      setIsNavbarEnabled(visible && window.scrollY <= navbarHeight);

      forcedHiddenByRouteRef.current = !visible;
      lastFadeTriggeredByRouteTimestampRef.current = Date.now();
    },
    [navbarHeight]
  );

  //-------------- SCROLL --------------
  const handleFadeNavbarOnScroll = useCallback(() => {
    // the route gets ultimate override over whether the navbar is displayed
    if (forcedHiddenByRouteRef.current) {
      return;
    }
    // if we recently triggered a route transition, ignore scroll-related side effects
    if (Date.now() - lastFadeTriggeredByRouteTimestampRef.current < 100) {
      return;
    }
    // if we're mid-suspense, don't trigger any scroll-related side effects
    if (isPageInSuspenseRef.current) {
      return;
    }

    setFadeType('scroll');
    setIsNavbarEnabled(window.scrollY <= navbarHeight);
  }, [navbarHeight]);

  useEffect(() => {
    window.addEventListener('scroll', handleFadeNavbarOnScroll);
    return () => {
      window.removeEventListener('scroll', handleFadeNavbarOnScroll);
    };
  }, [handleFadeNavbarOnScroll]);

  //-------------- HOVER ---------------
  const handleFadeNavbarOnHover = useCallback(
    (visible: boolean) => {
      // handle override. the route gets ultimate power over whether the navbar is displayed
      if (forcedHiddenByRouteRef.current) {
        return;
      }
      // if we recently triggered a route transition, ignore hover-related side effects
      if (Date.now() - lastFadeTriggeredByRouteTimestampRef.current < 100) {
        return;
      }
      // if we're mid-suspense, don't trigger any hover-related side effects
      if (isPageInSuspenseRef.current) {
        return;
      }
      // prevent touchscreen users from triggering the navbar by tapping near the top of the screen
      if (isTouchscreen.current) {
        return;
      }
      // prevent nav from fading out if user is near the top of the page and hovers in/out of nav area
      if (!visible && window.scrollY <= navbarHeight) {
        return;
      }

      setFadeType('hover');
      setIsNavbarEnabled(visible);
    },
    [navbarHeight]
  );

  const state = useMemo(
    () => ({ isNavbarVisible, wasNavbarVisible, isPageInSuspenseRef }),
    [isNavbarVisible, wasNavbarVisible]
  );

  const [content, setContent] = useState<ReactElement | null>(null);

  const actions: GlobalLayoutActions = useMemo(
    () => ({
      setBannerVisible,
      setNavbarVisible: handleFadeNavbarFromGalleryRoute,
      setIsPageInSuspenseState,
      setContent,
    }),
    [handleFadeNavbarFromGalleryRoute]
  );

  // Keeping this around for the next time we want to use it
  useGlobalAnnouncementPopover({ queryRef: query, authRequired: false, dismissVariant: 'global' });

  return (
    // note: we render the navbar here, above the main contents of the app,
    // so that it can remain fixed across page transitions. the footer, on
    // the other hand, is rendered at `GalleryRoute`.
    <>
      <GlobalNavbarWithFadeEnabled
        queryRef={query}
        isVisible={isNavbarVisible}
        isBannerVisible={isBannerVisible}
        wasVisible={wasNavbarVisible}
        fadeType={fadeType}
        handleFadeNavbarOnHover={handleFadeNavbarOnHover}
        content={content}
      />

      <GlobalLayoutStateContext.Provider value={state}>
        <GlobalLayoutActionsContext.Provider value={actions}>
          {children}
        </GlobalLayoutActionsContext.Provider>
      </GlobalLayoutStateContext.Provider>
    </>
  );
});

GlobalLayoutContextProvider.preloadQuery = ({ relayEnvironment }: PreloadQueryArgs) => {
  fetchQuery<GlobalLayoutContextQuery>(relayEnvironment, GlobalLayoutContextQueryNode, {
    collectionIds: FEATURED_COLLECTION_IDS,
  }).toPromise();
};

GlobalLayoutContextProvider.displayName = 'GlobalLayoutContextProvider';

type GlobalNavbarWithFadeEnabledProps = {
  queryRef: GlobalLayoutContextNavbarFragment$key;
  isVisible: boolean;
  wasVisible: boolean;
  handleFadeNavbarOnHover: (visible: boolean) => void;
  fadeType: FadeTriggerType;
  isBannerVisible: boolean;
  content: GlobalNavbarProps['content'];
};

function GlobalNavbarWithFadeEnabled({
  queryRef,
  isVisible,
  wasVisible,
  handleFadeNavbarOnHover,
  fadeType,
  isBannerVisible,
  content,
}: GlobalNavbarWithFadeEnabledProps) {
  const query = useFragment(
    graphql`
      fragment GlobalLayoutContextNavbarFragment on Query {
        ...GlobalBannerFragment
      }
    `,
    queryRef
  );

  // transition styles on the navbar are in accordance with our route transitions
  const transitionStyles = useMemo(() => {
    //----------- FADING OUT -----------
    // always fade out navbar without delay
    if (wasVisible) {
      return `opacity ${FADE_TRANSITION_TIME_MS}ms ease-in-out;`;
    }

    //----------- FADING IN ------------
    if (!wasVisible) {
      // if scrolling, fade-in navbar without delay
      if (fadeType === 'scroll' || fadeType === 'hover') {
        return `opacity ${FADE_TRANSITION_TIME_MS}ms ease-in-out`;
      }
      // if moving between routes, fade-in navbar with delay
      if (fadeType === 'route') {
        return `opacity ${FADE_TRANSITION_TIME_MS}ms ease-in-out ${FADE_TRANSITION_TIME_MS}ms`;
      }
    }
  }, [wasVisible, fadeType]);

  const isTouchscreen = useRef(isTouchscreenDevice());
  const [zIndex, setZIndex] = useState(2);
  useEffect(() => {
    if (!isVisible) {
      if (
        // for touch-enabled devices, we need to keep the upper area of the screen clickable;
        // without this, users wouldn't be able to click near the top of the device
        isTouchscreen.current ||
        // if the route doesn't want the navbar to be in view, we need to remove it completely
        // so that the user can click on elements where the navbar would be
        fadeType === 'route'
      ) {
        // this is normally as simple as setting the navbar z-index to -1, but doing so right
        // away makes it look like the navbar vanishes immediately; therefore we add a delay
        // until the navbar has already faded out of sight.
        const timeoutId = setTimeout(() => setZIndex(-1), FADE_TRANSITION_TIME_MS);

        return () => clearTimeout(timeoutId);
      }
    }
    setZIndex(2);
  }, [isVisible, fadeType]);

  const handleMouseEnter = useCallback(
    () => handleFadeNavbarOnHover(true),
    [handleFadeNavbarOnHover]
  );

  const handleMouseLeave = useCallback(
    () => handleFadeNavbarOnHover(false),
    [handleFadeNavbarOnHover]
  );

  const navbarHeight = useGlobalNavbarHeight();

  return (
    <StyledGlobalNavbarWithFadeEnabled
      isVisible={isVisible}
      transitionStyles={transitionStyles}
      zIndex={zIndex}
      navbarHeight={navbarHeight}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isBannerVisible && (
        <Banner
          localStorageKey={MAINTENANCE_BANNER_6_18_STORAGE_KEY}
          text=""
          queryRef={query}
          dismissOnActionComponentClick
          requireAuth
        />
      )}
      <GlobalNavbar content={content} />
    </StyledGlobalNavbarWithFadeEnabled>
  );
}

const StyledGlobalNavbarWithFadeEnabled = styled.div<{
  isVisible: boolean;
  transitionStyles?: string;
  zIndex: number;
  navbarHeight: number;
}>`
  position: fixed;
  width: 100%;
  z-index: ${({ zIndex }) => zIndex};
  height: ${({ navbarHeight }) => navbarHeight}px;

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: ${({ transitionStyles }) => transitionStyles};

  // prevent nav child elements from being clickable when not in view
  > div > div {
    pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  }
`;

export default GlobalLayoutContextProvider;