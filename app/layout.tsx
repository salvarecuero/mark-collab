import "./globals.css";
import { Patua_One, Gowun_Dodum } from "next/font/google";
import { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";

const patua = Patua_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patua",
  display: "swap",
});

const gowun = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={patua.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
