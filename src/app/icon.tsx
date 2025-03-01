import { ImageResponse } from "next/og";
import { Geist } from "next/font/google";

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "900",
});

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: geistMono.style.fontFamily,
          borderRadius: "8px",
        }}
      >
        <span style={{ color: "#4ade80" }}>FX</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
