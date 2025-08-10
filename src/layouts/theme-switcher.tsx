"use client";

import { cn } from "@/lib/utils";

import { useUiStore } from "@/lib/stores/ui-store";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Monitor, Moon, Sun } from "lucide-react";

import { Theme } from "@/lib/types";

export default function ThemeSwitcher({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { theme, updateTheme } = useUiStore();

  const themeIcons: Record<Theme, React.ReactNode> = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(className)}
          variant="outline"
          size="icon"
          {...props}
        >
          {themeIcons[theme]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateTheme("light")}>
          <Sun className="me-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme("dark")}>
          <Moon className="me-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme("system")}>
          <Monitor className="me-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
