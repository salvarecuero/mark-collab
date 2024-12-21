import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-2xl font-bold text-white font-patua", className)}>
      Mark-Collab
    </div>
  );
};

export default Logo;
