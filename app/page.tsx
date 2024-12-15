import AuthButton from "@/components/header-auth";
import Link from "next/link";

export default async function Index() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-white bg-black">
      <h1 className="text-8xl font-bold">Mark-Collab</h1>
      <p className="text-2xl">
        A platform for creating and collaborating on markdowns
      </p>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p>New user?</p>
          <Link
            className="text-blue-500 p-2 rounded-md border border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            href="/auth/sign-up"
          >
            Sign up
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p>Already have an account?</p>
          <Link
            className="text-blue-500 p-2 rounded-md border border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
