"use client";

import { cn } from "@/lib/utils";

import { useUiStore } from "@/lib/stores/ui-store";

export default function SidebarBackdrop({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toggleSideBarState } = useUiStore();
  return (
    <div
      data-sidebar="backdrop"
      data-slot="sidebar-backdrop"
      className={cn(
        // Base styling
        "cursor-pointer",
        // Mobile-only backdrop with positioning and base dimensions
        "mobile:fixed mobile:top-0 mobile:z-40 mobile:h-screen",
        "mobile:w-[calc(100vw-var(--sidebar-width-expanded))] mobile:bg-black/50 mobile:backdrop-blur-sm",
        // Sliding transitions with max-width and inset-inline-start
        "mobile:sidebar-collapsed:max-w-0 mobile:sidebar-collapsed:start-0",
        "mobile:sidebar-expanded:max-w-full mobile:sidebar-expanded:start-[var(--sidebar-width-expanded)]",
        // Opacity and visibility states
        "mobile:sidebar-collapsed:opacity-0 mobile:sidebar-collapsed:invisible",
        "mobile:sidebar-expanded:opacity-100 mobile:sidebar-expanded:visible",
        // Hide on desktop
        "desktop:hidden",
        // Smooth transitions for sliding effect, opacity, and visibility
        "mobile:transition-[max-width,inset-inline-start,opacity,visibility] mobile:duration-300 mobile:ease-in-out mobile:overflow-hidden",
        className
      )}
      onClick={() => {
        toggleSideBarState();
      }}
      {...props}
    >
      <span className="sr-only">Close Sidebar</span>
    </div>
  );
}
