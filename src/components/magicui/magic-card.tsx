"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}

export function MagicCard({
  children,
  className,
  gradientColor = "rgba(139, 92, 246, 0.15)",
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !overlayRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${gradientColor}, transparent 40%)`;
    },
    [gradientColor]
  );

  const handleMouseEnter = useCallback(() => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-200 hover:border-zinc-700",
        className
      )}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
