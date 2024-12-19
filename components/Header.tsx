import Link from "next/link";
import SignOutButton from "./SignOutButton";
import Logo from "./Logo";

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/dashboard">
        <Logo />
      </Link>

      <div className="flex items-center">{children}</div>

      <div className="flex items-center gap-2">
        <Link href="/">Home</Link>
        <SignOutButton />
      </div>
    </header>
  );
};

export default Header;
