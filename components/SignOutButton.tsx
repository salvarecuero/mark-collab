import { signOutAction } from "@/actions/auth";
import { Button } from "./ui/button";
import { ComponentProps } from "react";

const SignOutButton = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={"outline"} {...props}>
        {children || "Sign out"}
      </Button>
    </form>
  );
};

export default SignOutButton;
