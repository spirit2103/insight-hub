import { FileSearch } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-accent-foreground">
        <FileSearch className="w-5 h-5" />
      </div>
      {showText && (
        <span className="text-xl font-semibold text-foreground tracking-tight">
          DocuMind
        </span>
      )}
    </div>
  );
}
