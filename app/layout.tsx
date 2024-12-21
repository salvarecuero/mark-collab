import "./globals.css";
import { Patua_One, Gowun_Dodum } from "next/font/google";

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

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mark Collab",
  description: "Mark Collab is a collaborative markdown editor",
};

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
