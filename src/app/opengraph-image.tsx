import { ImageResponse } from "next/og";

// Branded social-share card (1200×630). Next applies this as og:image for every
// route that doesn't define its own; Twitter falls back to it via og:image too.
export const alt =
  "LUKSO UP!Store — Discover Mini-Apps for your Universal Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #4A4FB0 0%, #5B5FC7 45%, #939ACA 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: 96, fontWeight: 700 }}>LUKSO</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 26px",
              borderRadius: 24,
              background: "#ffffff",
              color: "#4A4FB0",
              fontSize: 80,
              fontWeight: 700,
            }}
          >
            UP!
          </div>
          <span style={{ fontSize: 96, fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>
            Store
          </span>
        </div>
        <div
          style={{
            marginTop: 44,
            maxWidth: 920,
            textAlign: "center",
            fontSize: 38,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Discover Mini-Apps for your Universal Profile
        </div>
      </div>
    ),
    { ...size }
  );
}
