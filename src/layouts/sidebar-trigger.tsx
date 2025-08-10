"use client";

import { cn } from "@/lib/utils";

import { useUiStore } from "@/lib/stores/ui-store";

import { Button } from "@/components/ui/button";

import { PanelLeftIcon } from "lucide-react";

export default function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSideBarState } = useUiStore();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSideBarState();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
