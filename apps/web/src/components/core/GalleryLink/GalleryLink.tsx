// eslint-disable-next-line no-restricted-imports
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Route } from 'nextjs-routes';
import {
  ComponentProps,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';

import { useModalActions } from '~/contexts/modal/ModalContext';
import { GalleryElementTrackingProps, useTrack } from '~/shared/contexts/AnalyticsContext';
import colors from '~/shared/theme/colors';
import { normalizeUrl } from '~/utils/normalizeUrl';

import { BODY_FONT_FAMILY } from '../Text/Text';
import transitions from '../transitions';
import VerifyNavigationPopover from './VerifyNavigationPopover';

export type GalleryLinkProps = ComponentProps<'a'> & {
  children: ReactNode;
  className?: string;
  to?: Route;
  href?: string;
  onClick?: MouseEventHandler;
  // allows the parent to override default link styles
  inheritLinkStyling?: boolean;
  // open the link in a new tab or not
  target?: HTMLAnchorElement['target'];
} & {
  // make tracking props optional given `GalleryLink` often has
  // a parent element with embedded tracking, and we auto-track links
  eventElementId?: GalleryElementTrackingProps['eventElementId'];
  eventName?: GalleryElementTrackingProps['eventName'];
  eventContext?: GalleryElementTrackingProps['eventContext'];
} & Omit<GalleryElementTrackingProps, 'eventElementId' | 'eventName' | 'eventContext'>;

export default function GalleryLink({
  to,
  href,
  children,
  className,
  onClick,
  inheritLinkStyling = false,
  target = '_blank',
  eventElementId = 'Unlabeled Link',
  eventName = 'Unlabeled Link Click',
  eventContext,
  eventFlow,
  properties,
}: GalleryLinkProps) {
  const track = useTrack();

  if (!to && !href && !onClick) {
    console.error('no link provided for GalleryLink');
  }

  const normalizedUrl = useMemo(() => normalizeUrl({ to, href }), [href, to]);

  const handleClick = useCallback<MouseEventHandler>(
    (event) => {
      event.stopPropagation();

      track('Link Click', {
        to: normalizedUrl,
        needsVerification: false,
        id: eventElementId,
        name: eventName,
        context: eventContext,
        flow: eventFlow,
        type: to ? 'internal' : 'external',
        ...properties,
      });

      onClick?.(event);
    },
    [
      eventContext,
      eventElementId,
      eventFlow,
      eventName,
      normalizedUrl,
      onClick,
      properties,
      to,
      track,
    ]
  );

  if (to) {
    return (
      <Link href={to} passHref legacyBehavior>
        <StyledAnchor
          onClick={handleClick}
          className={className}
          inheritStyles={inheritLinkStyling}
        >
          {children}
        </StyledAnchor>
      </Link>
    );
  }

  if (href) {
    return (
      <StyledAnchor
        href={href}
        target={target}
        rel="noreferrer"
        onClick={handleClick}
        className={className}
        inheritStyles={inheritLinkStyling}
      >
        {children}
      </StyledAnchor>
    );
  }

  if (onClick) {
    return (
      <StyledAnchor onClick={handleClick} className={className} inheritStyles={inheritLinkStyling}>
        {children}
      </StyledAnchor>
    );
  }

  return null;
}

const skipVerificationOnTheseRoutes = ['/features/'];

export function GalleryLinkNeedsVerification({
  inheritLinkStyling = false,
  href,
  children,
}: {
  inheritLinkStyling?: boolean;
  href: string;
  children: ReactNode;
}) {
  const { showModal } = useModalActions();
  const track = useTrack();
  const { pathname } = useRouter();

  const skipVerification = skipVerificationOnTheseRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const handleClick = useCallback(
    (e: MouseEvent, href: string) => {
      e.preventDefault();

      track('Link Click', {
        to: href,
        needsVerification: true,
      });

      // on certain routes like our content pages, we trust the external links displayed and thefore dont need to show a verification
      if (skipVerification && typeof window !== 'undefined') {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }

      showModal({
        content: <VerifyNavigationPopover href={href} />,
        isFullPage: false,
        headerText: 'Leaving gallery.so?',
      });
    },
    [showModal, skipVerification, track]
  );
  return (
    <GalleryLink
      inheritLinkStyling={inheritLinkStyling}
      onClick={(e) => {
        handleClick(e, href);
      }}
    >
      {children}
    </GalleryLink>
  );
}

export const StyledAnchor = styled.a<{ disabled?: boolean; inheritStyles?: boolean }>`
  color: ${colors.shadow};
  text-decoration: none;
  font-family: ${({ inheritStyles }) => (inheritStyles ? 'inherit' : BODY_FONT_FAMILY)};
  font-size: ${({ inheritStyles }) => (inheritStyles ? 'inherit' : '14px')};
  line-height: ${({ inheritStyles }) => (inheritStyles ? 'inherit' : '18px')};
  transition: color ${transitions.cubic};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    text-decoration: none;
    color: ${colors.black['800']};
  }
`;
