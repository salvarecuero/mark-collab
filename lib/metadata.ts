import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "Mark-Collab",
  description:
    "A platform for creating and collaborating on markdown documents in real-time",
  keywords: "markdown, collaboration, real-time editing, document sharing",
  authors: [{ name: "Salvador Recuero" }],
  creator: "Salvador Recuero",
  publisher: "Salvador Recuero",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mark-collab.vercel.app",
    siteName: "Mark-Collab",
    title: "Mark-Collab - Collaborative Markdown Editor",
    description: "Create and collaborate on markdown documents in real-time",
    images: [
      {
        url: "images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mark-Collab Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark-Collab - Collaborative Markdown Editor",
    description: "Create and collaborate on markdown documents in real-time",
    images: ["images/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
