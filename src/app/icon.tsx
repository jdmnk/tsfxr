import { ImageResponse } from "next/og";

// This file will generate multiple different icons in different sizes,
// they can be viewed at /icon/small, /icon/large, /icon/og, etc.

export const sizes = {
  favicon: {
    width: 32,
    height: 32,
  },
  apple: {
    width: 180,
    height: 180,
  },
  small: {
    width: 192,
    height: 192,
  },
  large: {
    width: 512,
    height: 512,
  },
  og: {
    width: 1200,
    height: 630,
  },
};

const fontSizes = {
  favicon: 20,
  apple: 120,
  small: 120,
  large: 360,
  og: 320,
};

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: sizes.favicon,
      id: "favicon",
    },
    {
      contentType: "image/png",
      size: sizes.apple,
      id: "apple",
    },
    {
      contentType: "image/png",
      size: sizes.small,
      id: "small",
    },
    {
      contentType: "image/png",
      size: sizes.large,
      id: "large",
    },
    {
      contentType: "image/png",
      size: sizes.og,
      id: "og",
    },
  ];
}

export default async function Icon({ id }: { id: string }) {
  const size = sizes[id as keyof typeof sizes];
  const fontSize = fontSizes[id as keyof typeof fontSizes];

  return new ImageResponse(
    (
      <div
        style={{
          fontSize,
          background: "rgb(12, 10, 9)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Geist",
          borderRadius: id === "og" ? 0 : "20%", // Only round corners for app icons
        }}
      >
        {id === "og" ? (
          <>
            <span style={{ color: "#4ade80" }}>TS</span>
            <span style={{ fontSize, marginLeft: "-0.1em" }}>FXR</span>
          </>
        ) : (
          <span style={{ color: "#4ade80", fontSize }}>FX</span>
        )}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: await loadGoogleFont(),
          style: "normal",
        },
      ],
    }
  );
}

async function loadGoogleFont() {
  const url = `https://fonts.googleapis.com/css2?family=Geist:wght@700`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("Failed to load font data");
}
