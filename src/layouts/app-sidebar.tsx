import Link from "next/link";

import Sidebar, {
  SidebarHeader,
  getSidebarCollapseClasses,
} from "@/layouts/sidebar";

import { Ghost } from "lucide-react";

// Define the interface for AppSidebar props
interface AppSidebarProps extends React.ComponentProps<"aside"> {
  variant?: "default" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon";
}

export function AppSidebar({
  className,
  variant,
  collapsible,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar
      variant={variant}
      className={className}
      collapsible={collapsible}
      {...props}
    >
      <SidebarHeader className="flex flex-col gap-2">
        <Link
          href="/"
          className="transition-[gap,margin] duration-300 flex items-center gap-3 sidebar-collapsed:gap-0 hover:bg-primary/10 rounded-lg p-2"
        >
          <Ghost className="w-sidebar-width-icon h-sidebar-width-icon text-primary-foreground shrink-0 rounded-lg bg-primary p-1.5" />
          <h1
            className={getSidebarCollapseClasses(
              "font-bold text-sm truncate max-w-full"
            )}
          >
            Next.js Styleguide
          </h1>
        </Link>
      </SidebarHeader>
    </Sidebar>
  );
}

export default AppSidebar;
