import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 mb-4">
        <Input readOnly value={url} className="flex-1" autoFocus={false} />
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={handleCopy} variant="outline" className="w-28">
              {copied ? "Copied!" : "Copy Link"}
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
