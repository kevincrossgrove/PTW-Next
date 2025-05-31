import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { twMerge } from "tailwind-merge";

export interface AppModalProps {
  open: boolean;
  onClose: () => void;
}

interface Props extends AppModalProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AppModal({
  open,
  onClose,
  title,
  description,
  header,
  content,
  footer,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-md">
        <DialogHeader className="pt-4">
          {header}
          <DialogTitle className={twMerge()}>{title}</DialogTitle>
          <DialogDescription className={twMerge("text-md")}>
            {description}
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
