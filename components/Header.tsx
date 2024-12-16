import Link from "next/link";
import SignOutButton from "./SignOutButton";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold">Mark-Collab</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/">Home</Link>
        <SignOutButton />
      </div>
    </header>
  );
};

export default Header;
