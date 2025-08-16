"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactCount: number;
  isLoading?: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  contactCount,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const isMultiple = contactCount > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-lg font-semibold">
                Delete Contact{isMultiple ? "s" : ""}
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                {isMultiple
                  ? `Are you sure you want to delete ${contactCount} contact${
                      contactCount === 1 ? "" : "s"
                    }? This action cannot be undone and all associated data will be permanently removed.`
                  : "Are you sure you want to delete this contact? This action cannot be undone and all associated data will be permanently removed."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
