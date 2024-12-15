import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-black flex flex-col items-center justify-center h-screen">
      <Link
        className="bg-white min-w-64 p-2 rounded-md flex items-center justify-center"
        href="/"
      >
        <ArrowLeftIcon className="w-6 h-6 text-black" />
      </Link>
      {children}
    </main>
  );
}
