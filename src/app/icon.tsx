import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#1A1610",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C8A050",
          fontWeight: 900,
          borderRadius: 6,
        }}
      >
        LM
      </div>
    ),
    { ...size }
  );
}
