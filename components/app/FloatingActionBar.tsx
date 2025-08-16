"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface FloatingActionBarProps {
  isVisible: boolean;
  selectedCount: number;
  onClose: () => void;
  actions: ReactNode;
  className?: string;
}

export function FloatingActionBar({
  isVisible,
  selectedCount,
  onClose,
  actions,
  className,
}: FloatingActionBarProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-xl border border-slate-600/50",
        "flex items-stretch min-w-[280px] sm:min-w-[320px] max-w-[85vw] sm:max-w-[90vw] overflow-hidden",
        "animate-in slide-in-from-bottom-4 fade-in-0 backdrop-blur-sm",
        className
      )}
    >
      {/* Left side - Close button */}
      <div
        className="bg-slate-800/80 flex items-center justify-center px-2 py-2 cursor-pointer"
        onClick={onClose}
      >
        <X size={24} className="text-white/70" />
      </div>

      {/* Right side - Selection count and Actions */}
      <div className="flex items-center gap-3 px-4 py-3 flex-1 bg-gradient-to-r from-slate-600 to-slate-800">
        <span className="text-xs font-medium text-white/90">
          {selectedCount} selected
        </span>
        <div className="flex items-center gap-2 ml-auto">{actions}</div>
      </div>
    </div>
  );
}
