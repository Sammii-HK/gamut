'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export function CopyButton({ text, className, size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'text-neutral-400 hover:text-white transition-colors',
        className
      )}
      title="Copy"
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  );
}
