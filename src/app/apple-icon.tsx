import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "#1A1610",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C8A050",
          fontWeight: 900,
          borderRadius: 36,
        }}
      >
        LM
      </div>
    ),
    { ...size }
  );
}
