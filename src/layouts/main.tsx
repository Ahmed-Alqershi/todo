import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const mainVariants = cva("", {
  variants: {
    variant: {
      default: ["bg-background  mt-layout-space me-layout-space"],
      inset: [
        "bg-background/80 backdrop-blur-md ms-layout-space me-layout-space mb-layout-space",
        "desktop:rounded-b-2xl",
        "desktop:shadow-[1px_0px_0px_0px_rgb(0_0_0_/_0.05),_-1px_0px_0px_0px_rgb(0_0_0_/_0.05),_0px_1px_0px_0px_rgb(0_0_0_/_0.05)]",
        "h-[calc(100dvh-(var(--header-height)+(var(--layout-spacing)*2)))]",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MainProps
  extends React.ComponentProps<"main">,
    VariantProps<typeof mainVariants> {}

const Main = ({ className, variant, children, ...props }: MainProps) => {
  return (
    <main
      className={cn(mainVariants({ variant }), className)}
      data-main-variant={variant}
      {...props}
    >
      {variant === "inset" ? (
        <ScrollArea className="h-full">
          {children} <ScrollBar />
        </ScrollArea>
      ) : (
        children
      )}
    </main>
  );
};

export default Main;
