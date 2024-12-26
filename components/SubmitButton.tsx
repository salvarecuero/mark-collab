"use client";

import Button from "@/components/Button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

const SubmitButton = ({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
};

export default SubmitButton;
