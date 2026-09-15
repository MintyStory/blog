"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/components/providers/SidebarProvider";

const SIDEBAR_WIDTH = "min(380px, 85vw)";

export default function PageShell({ children }: { children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <div
      style={{ marginLeft: open ? SIDEBAR_WIDTH : 0 }}
      className="min-h-screen transition-[margin-left] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      {children}
    </div>
  );
}
