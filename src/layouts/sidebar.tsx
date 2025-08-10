import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import SidebarBackdrop from "./sidebar-backdrop";

const sidebarVariants = cva(
  [
    "transition-[max-width,width,opacity,visibility,padding,margin] duration-300 ease-in-out overflow-hidden text-sidebar-foreground",
    "mobile:sidebar-expanded:p-layout-space",
    "mobile:fixed mobile:top-0 mobile:z-60 mobile:sidebar-collapsed:max-w-0",
    "mobile:sidebar-expanded:max-w-sidebar-width-expanded mobile:sidebar-expanded:w-sidebar-width-expanded",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-sidebar desktop:border-e desktop:border-sidebar-border",
          "h-dvh sticky top-0",
          "desktop:sidebar-expanded:p-layout-space",
        ],
        floating: [
          "bg-sidebar desktop:border desktop:border-sidebar-border desktop:rounded-lg desktop:shadow-sm",
          "h-[calc(100dvh-calc(var(--layout-spacing)*2))] sticky top-layout-space",
        ],
        inset: [
          "mobile:bg-sidebar h-[calc(100dvh-calc(var(--layout-spacing)*2))] sticky top-layout-space",
        ],
      },
      collapsible: {
        offcanvas: [
          "desktop:sidebar-collapsed:max-w-0 desktop:sidebar-collapsed:opacity-0 desktop:sidebar-collapsed:invisible desktop:sidebar-collapsed:pointer-events-none",
          "desktop:sidebar-expanded:relative desktop:sidebar-expanded:max-w-sidebar-width-expanded desktop:sidebar-expanded:opacity-100 desktop:sidebar-expanded:visible",
        ],
        icon: [],
      },
    },
    compoundVariants: [
      {
        variant: "default",
        collapsible: "icon",
        class: [
          "desktop:sidebar-collapsed:max-w-sidebar-width-collapsed desktop:sidebar-collapsed:w-sidebar-width-collapsed desktop:sidebar-collapsed:opacity-100 desktop:sidebar-collapsed:p-layout-spacing-icon",
          "desktop:sidebar-expanded:max-w-sidebar-width-expanded desktop:sidebar-expanded:w-sidebar-width-expanded desktop:sidebar-expanded:opacity-100",
        ],
      },
      {
        variant: "floating",
        collapsible: "icon",
        class: [
          "desktop:sidebar-collapsed:max-w-sidebar-width-collapsed desktop:sidebar-collapsed:w-sidebar-width-collapsed desktop:sidebar-collapsed:opacity-100 desktop:sidebar-collapsed:p-layout-spacing-icon",
          "desktop:sidebar-expanded:max-w-sidebar-width-expanded desktop:sidebar-expanded:w-sidebar-width-expanded desktop:sidebar-expanded:opacity-100",
          "desktop:ms-layout-space my-layout-space desktop:sidebar-expanded:p-layout-space",
        ],
      },
      {
        variant: "inset",
        collapsible: "icon",
        class: [
          "desktop:sidebar-collapsed:max-w-[calc(var(--sidebar-width-icon)+calc(var(--layout-spacing)))] desktop:sidebar-collapsed:w-[calc(var(--sidebar-width-icon)+calc(var(--layout-spacing)))] desktop:sidebar-collapsed:opacity-100",
          "desktop:sidebar-expanded:max-w-sidebar-width-expanded desktop:sidebar-expanded:w-sidebar-width-expanded desktop:sidebar-expanded:opacity-100",
          "desktop:ms-layout-space my-layout-space",
        ],
      },
      {
        variant: "floating",
        collapsible: "offcanvas",
        class: [
          "desktop:sidebar-expanded:m-layout-space desktop:sidebar-expanded:p-layout-space",
        ],
      },
    ],
    defaultVariants: {
      variant: "default",
      collapsible: "offcanvas",
    },
  }
);

interface SidebarProps
  extends React.ComponentProps<"aside">,
    VariantProps<typeof sidebarVariants> {
  children: React.ReactNode;
  collapsible?: "offcanvas" | "icon";
}

const Sidebar = ({
  className,
  variant,
  collapsible,
  children,
  ...props
}: SidebarProps) => {
  return (
    <aside
      className={cn(sidebarVariants({ variant, collapsible }), className)}
      data-sidebar-variant={variant}
      data-sidebar-collapsible={collapsible}
      {...props}
    >
      {children}
      <SidebarBackdrop />
    </aside>
  );
};

interface SidebarHeaderProps extends React.ComponentProps<"section"> {
  children: React.ReactNode;
}

const SidebarHeader = ({
  className,
  children,
  ...props
}: SidebarHeaderProps) => {
  return (
    <section className={cn(className)} {...props}>
      {children}
    </section>
  );
};

export default Sidebar;
export { SidebarHeader };

/**
 * Returns the Tailwind classes needed to hide content when the sidebar is collapsed
 */
export function getSidebarCollapseClasses(additionalClasses?: string) {
  return cn(
    "transition-[opacity,visibility,max-width] duration-150 ease-in-out sidebar-collapsed:max-w-0 sidebar-collapsed:opacity-0 sidebar-collapsed:invisible",
    additionalClasses
  );
}
