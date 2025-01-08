import { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import Header from "@/components/Header";
import "../globals.css";
import IbelickBackground from "@/components/IbelickBackground";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Dashboard | Mark-Collab",
  description: "Manage your markdown documents and collaborations",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Dashboard | Mark-Collab",
    description: "Manage your markdown documents and collaborations",
  },
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
