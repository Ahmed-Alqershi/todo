import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, ChevronRight } from "lucide-react";

// Types
type Sitemap = {
  name: string;
  path: string;
  children?: Sitemap[];
};

/**
 * Sitemap Configuration Documentation
 *
 * This sitemap defines the navigation structure for the application.
 *
 * How to add new entries:
 * 1. To add a top-level route:
 *    - Add a new object to the `children` array of the root ("Home") object
 *    - Required properties: `name` (display text) and `path` (URL path)
 *
 * 2. To add a nested route:
 *    - Find the parent route in the structure
 *    - Add to or create a `children` array in the parent object
 *    - Follow same format as top-level routes
 *
 * Example:
 * {
 *   name: "New Section",        // Display name
 *   path: "/new-section",       // URL path
 *   children: [                 // Optional nested routes
 *     { name: "Subpage", path: "/new-section/subpage" }
 *   ]
 * }
 *
 * Notes:
 * - Paths should start with "/"
 * - Keep the structure hierarchical (child paths should extend parent paths)
 * - Maintain consistent naming conventions
 * - Update any related routing logic if adding new top-level sections
 */
export const sitemap: Sitemap = {
  name: "Home",
  path: "/",
  children: [
    {
      name: "Colors",
      path: "/colors",
    },
  ],
};

/**
 * Generates a breadcrumb trail based on the current path and the site's sitemap structure.
 * The breadcrumbs represent the hierarchical path from the root to the current page.
 *
 * @param {string} currentPath - The current URL path (e.g., '/products/electronics')
 * @returns {Sitemap[]} An array of Sitemap objects representing the breadcrumb trail
 * @throws Will break and return the trail up to the last valid path if an invalid path segment is encountered
 */
export function generateBreadcrumbs(currentPath: string): Sitemap[] {
  const paths = currentPath.split("/").filter(Boolean);
  let currentNode: Sitemap = sitemap;
  const breadcrumbs: Sitemap[] = [currentNode];

  for (const path of paths) {
    const child = currentNode.children?.find((c) =>
      c.path.endsWith(`/${path}`)
    );
    if (child) {
      currentNode = child;
      breadcrumbs.push(currentNode);
    } else {
      break;
    }
  }

  return breadcrumbs;
}

/**
 * Checks if a path contains dynamic parameters (e.g., [id], [slug], etc.).
 *
 * @param {string} path - The path to check for dynamic parameters
 * @returns {boolean} True if the path contains dynamic parameters, false otherwise
 */
export function isDynamicPath(path: string): boolean {
  return path.includes("[") && path.includes("]");
}

export default function Breadcrumbs({ pathname }: { pathname: string | null }) {
  const breadcrumbs = generateBreadcrumbs(pathname || "/");

  const breadcrumbElements = breadcrumbs.flatMap((crumb, index) => {
    const isLast = index === breadcrumbs.length - 1;
    const elements = [];

    elements.push(
      <BreadcrumbItem key={index}>
        {isLast ? (
          <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
        ) : index != 0 && crumb.children && crumb.children.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {crumb.name}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <BreadcrumbLink asChild>
                  <Link href={crumb.path}>{crumb.name}</Link>
                </BreadcrumbLink>
              </DropdownMenuItem>
              {crumb.children.map((child: Sitemap, index) => (
                <DropdownMenuItem key={index} asChild>
                  <BreadcrumbLink asChild>
                    <Link href={child.path}>{child.name}</Link>
                  </BreadcrumbLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={crumb.path}>{crumb.name}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );

    if (!isLast) {
      elements.push(
        <BreadcrumbSeparator key={`separator-${index}`}>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
      );
    }

    return elements;
  });

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-2">
        {breadcrumbElements}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
