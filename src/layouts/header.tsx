import { headers } from "next/headers";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

import SidebarTrigger from "@/layouts/sidebar-trigger";
import ThemeSwitcher from "@/layouts/theme-switcher";

import Breadcrumbs from "@/components/breadcrumbs";

const headerVariants = cva("h-16 flex items-center gap-2", {
  variants: {
    variant: {
      default: ["bg-background border-b"],
      floating: [
        "bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-sm mt-layout-space me-layout-space m-layout-space",
      ],
      inset: [
        "bg-background/80 backdrop-blur-md",
        "desktop:rounded-t-lg desktop:mt-layout-space desktop:ms-layout-space desktop:me-layout-space",
        "desktop:shadow-[1px_0px_0px_0px_rgb(0_0_0_/_0.05),_-1px_0px_0px_0px_rgb(0_0_0_/_0.05),_0px_-1px_0px_0px_rgb(0_0_0_/_0.05)]",
      ],
    },
    sticky: {
      true: ["sticky z-50"],
      false: [""],
    },
  },
  compoundVariants: [
    {
      variant: "inset",
      sticky: true,
      class: ["desktop:top-layout-space mobile:top-0"],
    },
    {
      variant: "floating",
      sticky: true,
      class: ["top-layout-space"],
    },
  ],
  defaultVariants: {
    variant: "default",
    sticky: false,
  },
});

interface HeaderProps
  extends React.ComponentProps<"header">,
    VariantProps<typeof headerVariants> {
  sticky?: boolean;
}

const Header = async ({
  className,
  variant,
  sticky = false,
  ...props
}: HeaderProps) => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <header
      className={cn(headerVariants({ variant, sticky }), className)}
      data-header-variant={variant}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger />
        <Separator orientation="vertical" className="me-2" />
        <Breadcrumbs pathname={pathname} />
        <div className="ms-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
