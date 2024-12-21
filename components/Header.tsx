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
    <header
      className={cn(
        "flex justify-between items-center p-10 relative",
        className
      )}
    >
      <Link href="/dashboard">
        <Logo className={cn("text-4xl", logoClassName)} />
      </Link>

      <div className="flex items-center">{children}</div>

      <div className="flex items-center gap-2">
        <SignOutButton />
      </div>
    </header>
  );
};

export default Header;
