"use client";

import { Check, Copy, CircleAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export function CopyButton({ text, className, size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      setError(true);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-neutral-400 hover:text-white transition-colors",
        className,
      )}
      aria-label={
        error
          ? "Copy failed. Select and copy the text manually."
          : copied
            ? "Copied"
            : "Copy colour or code"
      }
      title={
        error
          ? "Copy failed. Select and copy manually."
          : copied
            ? "Copied"
            : "Copy"
      }
    >
      {error ? (
        <CircleAlert size={size} aria-hidden />
      ) : copied ? (
        <Check size={size} aria-hidden />
      ) : (
        <Copy size={size} aria-hidden />
      )}
    </button>
  );
}
