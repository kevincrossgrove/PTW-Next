import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Props extends DrawerProps {
  headerTitle?: string;
  headerDescription?: string;
  headerOptions?: React.ReactNode;
  body?: React.ReactNode;
  bodyCSS?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AppDrawer({
  open,
  onClose,
  headerTitle,
  headerDescription,
  headerOptions,
  body,
  bodyCSS,
  size = "md",
}: Props) {
  const getSizeClass = (size: "sm" | "md" | "lg" | "xl") => {
    switch (size) {
      case "sm":
        return "data-[vaul-drawer-direction=right]:sm:max-w-sm";
      case "md":
        return "data-[vaul-drawer-direction=right]:sm:max-w-md";
      case "lg":
        return "data-[vaul-drawer-direction=right]:sm:max-w-lg";
      case "xl":
        return "data-[vaul-drawer-direction=right]:sm:max-w-xl";
      default:
        return "data-[vaul-drawer-direction=right]:sm:max-w-md";
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onClose} handleOnly>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent className={getSizeClass(size)}>
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center ">
              <X
                onClick={onClose}
                className="cursor-pointer hover:bg-accent p-1 rounded"
                size={28}
              />
              <div className="ml-3">
                <DrawerTitle>{headerTitle}</DrawerTitle>
                <DrawerDescription>{headerDescription}</DrawerDescription>
              </div>
            </div>
            {headerOptions}
          </div>
        </DrawerHeader>
        <div
          className={twMerge("px-4 pt-4 pb-8 h-full overflow-y-auto", bodyCSS)}
        >
          {body}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
