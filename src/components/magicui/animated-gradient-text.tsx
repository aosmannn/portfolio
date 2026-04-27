import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #a78bfa, #c4b5fd, #7c3aed, #a78bfa)",
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        animation: "gradient-shift 4s linear infinite",
      }}
    >
      {children}
    </span>
  );
}
