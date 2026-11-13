import { ImageResponse } from "next/og";

export const alt = "Cota — Ingeniería de software de principio a fin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const paper = "#ECEAE4";
  const accent = "#FF5A36";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0C0D0C", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}>
        <svg width="350" height="200" viewBox="-8 -4 191 100">
          <g fill="none" stroke={paper} strokeWidth="8">
            <path d="M35.79 49.57A18 18 0 1 1 35.79 26.43" />
            <circle cx="70" cy="38" r="18" />
            <path d="M110 2V60M98 20H124" />
            <circle cx="153" cy="38" r="18" />
            <path d="M171 16V60" />
          </g>
          <path d="M2 70V90M173 70V90" stroke={paper} strokeWidth="2.5" fill="none" />
          <path d="M2 84H173" stroke={paper} strokeWidth="2" fill="none" />
          <path d="M-3 89L7 79M168 89L178 79" stroke={accent} strokeWidth="4" fill="none" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, color: paper, letterSpacing: -2, lineHeight: 1.05, maxWidth: 950 }}>
            Ingeniería de software de principio a fin.
          </div>
          <div style={{ fontSize: 26, color: "#A9A8A0" }}>Software a medida · Inteligencia artificial · IoT · Automatización</div>
        </div>
      </div>
    ),
    size,
  );
}
