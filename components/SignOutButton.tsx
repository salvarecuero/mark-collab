import { signOutAction } from "@/actions/auth";
import { Button } from "./ui/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const SignOutButton = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <form action={signOutAction}>
      <Button
        className={cn(
          "p-2 text-lg font-medium rounded-lg border-2 border-white hover:bg-white/20 transition-all duration-300",
          className
        )}
        type="submit"
        {...props}
      >
        {children || "Sign out"}
      </Button>
    </form>
  );
};

export default SignOutButton;
