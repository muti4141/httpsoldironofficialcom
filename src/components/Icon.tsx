import type { CSSProperties, ReactNode } from "react";

/**
 * Inline SVG icon set — replaces the Material Symbols icon font.
 * Line-based, 1.5px stroke, currentColor, never filled (except <Icon name="star" filled />).
 */

export type IconName =
  | "search"
  | "shopping_bag"
  | "shopping_cart"
  | "add_shopping_cart"
  | "menu"
  | "close"
  | "expand_more"
  | "expand_less"
  | "chevron_left"
  | "chevron_right"
  | "arrow_forward"
  | "arrow_back"
  | "local_shipping"
  | "assignment_return"
  | "restart_alt"
  | "science"
  | "verified"
  | "lock"
  | "star"
  | "add"
  | "remove"
  | "check"
  | "play_arrow"
  | "person"
  | "person_add"
  | "account_circle"
  | "login"
  | "logout"
  | "mail"
  | "alternate_email"
  | "location_on"
  | "photo_camera"
  | "public"
  | "workspace_premium"
  | "delete";

const PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  shopping_bag: (
    <>
      <path d="M6 7h12l1 13H5L6 7z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </>
  ),
  shopping_cart: (
    <>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
      <path d="M2 3h2.5l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.2L21 7H5.2" />
    </>
  ),
  add_shopping_cart: (
    <>
      <circle cx="10" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
      <path d="M2 3h2.3l2.1 11.2a1.5 1.5 0 0 0 1.5 1.2h9a1.5 1.5 0 0 0 1.5-1.2l.6-3.2" />
      <path d="M15 3v6" />
      <path d="M12 6h6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  expand_more: <path d="M6 9.5l6 6 6-6" />,
  expand_less: <path d="M6 14.5l6-6 6 6" />,
  chevron_left: <path d="M15 5l-7 7 7 7" />,
  chevron_right: <path d="M9 5l7 7-7 7" />,
  arrow_forward: (
    <>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </>
  ),
  arrow_back: (
    <>
      <path d="M20 12H4" />
      <path d="M10 6l-6 6 6 6" />
    </>
  ),
  local_shipping: (
    <>
      <path d="M2 6.5h11v10H2z" />
      <path d="M13 10h4l3 3.2v3.3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  assignment_return: (
    <>
      <path d="M6 4h12a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M9 3.5h6v2.5H9z" />
      <path d="M15 13H9" />
      <path d="M11.5 10.5L9 13l2.5 2.5" />
    </>
  ),
  restart_alt: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 3-6" />
      <path d="M7.5 2.8V6h3.2" />
    </>
  ),
  science: (
    <>
      <path d="M9.5 3v6.2L4.8 17.4A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 1.7-3.1L14.5 9.2V3" />
      <path d="M8.5 3h7" />
      <path d="M7.2 14.5h9.6" />
    </>
  ),
  verified: (
    <>
      <path d="M12 2.8l2.4 2.1 3.2-.3.4 3.2 2.4 2.1-1.7 2.7 1 3.1-3.1.9-1.5 2.9-3.1-1-3.1 1-1.5-2.9-3.1-.9 1-3.1L3.6 9.9 6 7.8l.4-3.2 3.2.3z" />
      <path d="M9 12l2.2 2.2L15.4 10" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.7 5.5 6 .9-4.35 4.2 1.03 6-5.38-2.83L6.62 20.1l1.03-6L3.3 9.9l6-.9z" />
  ),
  add: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  remove: <path d="M5 12h14" />,
  check: <path d="M5 12.8l4.6 4.6L19 7.6" />,
  play_arrow: <path d="M8 5.2l11 6.8-11 6.8z" />,
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  person_add: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M2.8 20.5a7.2 7.2 0 0 1 14.4 0" />
      <path d="M19 6.5v5" />
      <path d="M16.5 9h5" />
    </>
  ),
  account_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M5.8 18.6a7 7 0 0 1 12.4 0" />
    </>
  ),
  login: (
    <>
      <path d="M14 3.5h4.5a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H14" />
      <path d="M10 8l4 4-4 4" />
      <path d="M14 12H3.5" />
    </>
  ),
  logout: (
    <>
      <path d="M10 3.5H5.5A1.5 1.5 0 0 0 4 5v14a1.5 1.5 0 0 0 1.5 1.5H10" />
      <path d="M16 8l4 4-4 4" />
      <path d="M20 12H9.5" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </>
  ),
  alternate_email: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M15.6 8.4v4.9a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.5 7" />
    </>
  ),
  location_on: (
    <>
      <path d="M12 21.2s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  photo_camera: (
    <>
      <path d="M3.5 7.5h3.6l1.4-2.2h7l1.4 2.2h3.6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.6" />
    </>
  ),
  public: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z" />
    </>
  ),
  workspace_premium: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.4 14.2L7 21.5l5-2.6 5 2.6-1.4-7.3" />
    </>
  ),
  delete: (
    <>
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V4.2h5v2.3" />
      <path d="M6.5 6.5l.9 13a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9l.9-13" />
      <path d="M10.5 10.5v6" />
      <path d="M13.5 10.5v6" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Only meaningful for `star` — renders a solid star (ratings). */
  filled?: boolean;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 20,
  className,
  style,
  filled = false,
  strokeWidth = 1.5,
}: IconProps) {
  const solid = filled && name === "star";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      {PATHS[name]}
    </svg>
  );
}

export default Icon;
