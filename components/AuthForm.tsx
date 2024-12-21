import { signInAction, signUpAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
  searchParams: Message;
}

const AuthForm = ({ type, searchParams }: AuthFormProps) => {
  const isSignIn = type === "sign-in";

  return (
    <form className="flex flex-col min-w-64 text-white">
      <div className="flex flex-col items-center justify-center mt-5">
        <h1 className="text-2xl font-medium">
          {isSignIn ? "Sign in" : "Sign up"}
        </h1>

        <span className="text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            className="font-medium underline"
            href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </span>
      </div>

      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {!isSignIn && (
          <>
            <Label htmlFor="fullName">Full Name</Label>
            <Input name="fullName" placeholder="Your name" required />
          </>
        )}

        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          {isSignIn && (
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          )}
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={isSignIn ? undefined : 6}
          required
        />

        <SubmitButton
          formAction={isSignIn ? signInAction : signUpAction}
          pendingText={isSignIn ? "Signing in..." : "Signing up..."}
        >
          {isSignIn ? "Sign in" : "Sign up"}
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
};

export default AuthForm;
