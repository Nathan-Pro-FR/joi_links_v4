import * as React from "react";

export const ICON_PATHS: Record<string, string> = {
  search: "M11 11l4 4M7.5 13a5.5 5.5 0 100-11 5.5 5.5 0 000 11z",
  heart: "M8 14s-5-3.2-5-7a2.8 2.8 0 015-1.7A2.8 2.8 0 0113 7c0 3.8-5 7-5 7z",
  star: "M8 1.6l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.9 4.3 13l.8-4.2L2 5.9l4.2-.5z",
  clock: "M8 4.5V8l2.4 1.6M8 14.5A6.5 6.5 0 108 1.5a6.5 6.5 0 000 13z",
  grid: "M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z",
  sliders: "M3 5h7M13 5h0M3 11h3M9 11h4M11 3.5v3M6 9.5v3",
  play: "M5.5 3.5l7 4.5-7 4.5z",
  folder: "M2.5 4.5a1 1 0 011-1h3l1.3 1.5h4.4a1 1 0 011 1v5a1 1 0 01-1 1h-9a1 1 0 01-1-1z",
  flame:
    "M8 1.5c1 2.2-.5 3.2-.5 4.8 0 .9.7 1.4 1.2 1 .9-.7.6-2 .6-2 1.6 1 2.2 2.4 2.2 3.7A3.5 3.5 0 018 14.5 3.5 3.5 0 014.5 11c0-2.4 1.8-3.6 2.3-6 .2-1 .4-2.4 1.2-3.5z",
  clock2: "M8 4.5V8l2.4 1.6M8 14.5A6.5 6.5 0 108 1.5a6.5 6.5 0 000 13z",
  sparkle: "M8 2l1.1 3.4L12.5 6.5 9.1 7.6 8 11 6.9 7.6 3.5 6.5l3.4-1.1z",
  bookmark: "M4 2.5h8v11l-4-2.5-4 2.5z",
  link: "M6.5 9.5l3-3M7 5l1-1a2.1 2.1 0 013 3l-1 1M9 11l-1 1a2.1 2.1 0 01-3-3l1-1",
  eye: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8zM8 10a2 2 0 100-4 2 2 0 000 4z",
  shuffle: "M2.5 4.5h2l7 7h2M11.5 4.5h2M2.5 11.5h2l3-3M12 2.5l1.5 2-1.5 2M12 9.5l1.5 2-1.5 2",
  plus: "M8 3.5v9M3.5 8h9",
  chevron: "M6 4l4 4-4 4",
  settings:
    "M8 10a2 2 0 100-4 2 2 0 000 4zM8 1.5l1 1.6 1.9-.4.5 1.9 1.7.9-.9 1.7.9 1.7-1.7.9-.5 1.9-1.9-.4-1 1.6-1-1.6-1.9.4-.5-1.9-1.7-.9.9-1.7-.9-1.7 1.7-.9.5-1.9 1.9.4z",
  close: "M4 4l8 8M12 4l-8 8",
  menu: "M2.5 4.5h11M2.5 8h11M2.5 11.5h11",
  volume: "M3 6.5h2L8 4v8L5 9.5H3zM10.5 6a3 3 0 010 4",
  check: "M3 8l3 3 6-6",
  trash: "M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8M7 7.5v4M9 7.5v4",
};

type Props = {
  d: keyof typeof ICON_PATHS | string;
  size?: number;
  sw?: number;
  fill?: string;
  style?: React.CSSProperties;
  className?: string;
};

export function Icon({ d, size = 16, sw = 1.6, fill = "none", style, className }: Props) {
  const path = ICON_PATHS[d] || d;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fill}
      stroke={fill === "none" ? "currentColor" : "none"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "0 0 auto", display: "block", ...style }}
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
