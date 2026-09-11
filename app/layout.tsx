import type { Metadata, Viewport } from "next";
import { SiteAudio } from "@/components/SiteAudio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Eunchae Won — Real-Time Digital Artist · Creative Developer",
    template: "%s — Eunchae Won",
  },
  description:
    "Portfolio of Eunchae Won, a real-time digital artist and creative developer working across Unreal Engine, Unity, 3D, moving image, and performance.",
  applicationName: "Eunchae Won Portfolio",
  authors: [{ name: "Eunchae Won" }],
  creator: "Eunchae Won",
  keywords: [
    "real-time digital artist",
    "creative developer",
    "solo game developer",
    "indie game developer",
    "Unreal Engine 5",
    "Unity",
    "3D artist",
    "Eunchae Won",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Eunchae Won — Real-Time Digital Artist · Creative Developer",
    description:
      "Games, moving-image works, and strange digital characters by Eunchae Won.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eunchae Won — Real-Time Digital Artist · Creative Developer",
    description:
      "Games, moving-image works, and strange digital characters by Eunchae Won.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e6",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteAudio />
      </body>
    </html>
  );
}
