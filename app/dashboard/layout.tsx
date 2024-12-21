import Header from "@/components/Header";
import "../globals.css";
import IbelickBackground from "@/components/IbelickBackground";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mark-Collab",
  description: "Mark Collab is a collaborative markdown editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col h-screen text-white">
      <IbelickBackground type="blue-violet" />
      <Header />
      {children}
    </main>
  );
}
