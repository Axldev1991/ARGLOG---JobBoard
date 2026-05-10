"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
}

export function SubmitButton({ 
  children, 
  loadingText, 
  className, 
  disabled, 
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      disabled={pending || disabled}
      className={cn("relative", className)}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
