import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const finalURL =
    url && typeof window !== "undefined"
      ? `${window.location.origin}${url}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 mb-4">
        <div className="min-w-0 text-xs border border-primary bg-muted rounded-lg overflow-hidden whitespace-nowrap truncate px-2 py-2">
          {finalURL}
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Button asChild variant="outline">
              <div className="w-28" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Link"}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied to clipboard" : "Click to copy link"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
