import Link from "next/link";
import SignOutButton from "./SignOutButton";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const Header = ({
  children,
  className,
  logoClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  logoClassName?: string;
}) => {
  return (
    <header className={cn("flex flex-col gap-y-1 p-10", className)}>
      <div className="flex items-center gap-x-2 justify-between">
        <Link href="/dashboard">
          <Logo className={cn("text-4xl", logoClassName)} />
        </Link>

        <div className="items-center hidden md:flex">{children}</div>

        <div className="flex items-center gap-2">
          <SignOutButton />
        </div>
      </div>

      <div className="flex items-center justify-center md:hidden">
        {children}
      </div>
    </header>
  );
};

export default Header;
