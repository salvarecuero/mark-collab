import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const Spinner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-10 w-10 border-t-2 border-b-4 border-white",
        className
      )}
      {...props}
    />
  );
};

export default Spinner;
