import * as React from "react";

const HUES = [168, 280, 318, 198, 22, 254, 142, 340];

export function thumbBg(seed: number): React.CSSProperties {
  const h = HUES[seed % HUES.length];
  const h2 = (h + 38) % 360;
  return {
    backgroundColor: `oklch(0.30 0.10 ${h})`,
    backgroundImage:
      `radial-gradient(120% 90% at 18% 12%, oklch(0.42 0.13 ${h2}) 0%, transparent 55%),` +
      `radial-gradient(120% 120% at 86% 96%, oklch(0.22 0.09 ${h}) 0%, transparent 60%),` +
      `repeating-linear-gradient(125deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 13px)`,
  };
}

type Props = {
  seed?: number;
  blur?: boolean;
  label?: string;
  radius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  thumbUrl?: string;
};

export function Thumb({ seed = 0, blur = false, label, radius = 14, children, style, thumbUrl }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        overflow: "hidden",
        ...(thumbUrl
          ? { backgroundImage: `url(${JSON.stringify(thumbUrl)})`, backgroundSize: "cover", backgroundPosition: "center" }
          : thumbBg(seed)),
        filter: blur ? "blur(14px) saturate(1.1)" : "none",
        transform: blur ? "scale(1.08)" : "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 11,
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.66)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
