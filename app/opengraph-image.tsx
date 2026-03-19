import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapPLC™ – Generate PLC Code from a Photo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.15,
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "#00d4ff", fontSize: 72, fontWeight: 800, letterSpacing: "-3px" }}>
            Snap
          </span>
          <span style={{ color: "#e6edf3", fontSize: 72, fontWeight: 800, letterSpacing: "-3px" }}>
            PLC
          </span>
          <span
            style={{
              color: "#00d4ff",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            ™
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#8b949e",
            fontSize: 32,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          Point your phone at the panel.
          <br />
          We&apos;ll handle the rest.
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "40px",
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 999,
            padding: "8px 20px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#3fb950",
            }}
          />
          <span style={{ color: "#00d4ff", fontSize: 18, fontWeight: 600, letterSpacing: "1px" }}>
            AI-POWERED INDUSTRIAL DIAGNOSTICS
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
