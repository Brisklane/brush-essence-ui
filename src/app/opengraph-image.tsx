import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

// Default social-share card for any page that doesn't supply its own image
// (home, gallery, categories…). Product pages override this with the painting.
// Next serves this file as both og:image and twitter:image automatically.
export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f1d33 0%, #1e3a5f 100%)",
        color: "#f8fafc",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          color: "#d4af37",
          fontSize: 26,
          letterSpacing: 14,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Original Oil Paintings
      </div>
      <div style={{ fontSize: 116, fontWeight: 700, letterSpacing: -1 }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 34, color: "#cbd5e1", marginTop: 16 }}>
        {siteConfig.tagline}
      </div>
      <div
        style={{
          marginTop: 48,
          width: 120,
          height: 4,
          background: "#d4af37",
          borderRadius: 2,
        }}
      />
    </div>,
    size,
  );
}
