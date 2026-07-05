"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Shell } from "@/components/layout/shell";
import { navigation } from "@/components/layout/navigation";

function getTitle(pathname: string): string | undefined {
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item.label;
      }
    }
  }
  return undefined;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return <Shell title={title}>{children}</Shell>;
}
