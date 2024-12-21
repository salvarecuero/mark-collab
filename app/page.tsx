import IbelickBackground from "@/components/IbelickBackground";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function Index() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return (
    <main className="flex flex-col items-center justify-center h-screen text-white">
      <IbelickBackground type="default" />

      {user && <SignOutButton className="absolute top-10 right-10" />}

      <h1 className="text-8xl font-bold font-patua">Mark-Collab</h1>
      <p className="text-2xl">
        A platform for creating and collaborating on markdowns
      </p>

      <div className="flex items-end justify-center gap-8 mt-12">
        {user ? (
          <Link
            className="flex items-center gap-2 px-6 py-2 text-lg leading-none font-medium rounded-lg border-2 border-white text-white hover:bg-white/20 hover:border-white hover:text-white transition-all duration-300"
            href="/dashboard"
          >
            <span>Go to your projects</span>{" "}
            <ArrowRightIcon className="h-[18px]" />
          </Link>
        ) : (
          <>
            {" "}
            <div className="flex flex-col items-center gap-3">
              <Link
                className="px-6 py-2 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white/20 hover:border-white hover:text-white transition-all duration-300"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-lg text-gray-300 text-center italic">
                New user?
              </span>
              <Link
                className="px-6 py-2 text-lg font-medium rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all duration-300"
                href="/auth/sign-up"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
