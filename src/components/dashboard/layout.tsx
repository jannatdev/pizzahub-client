"use client";

import { useState, type ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import type { AuthUser } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  /** Resolved server-side from the Better Auth session (src/lib/session.ts). */
  user: AuthUser;
  children: ReactNode;
}

/**
 * Reusable dashboard shell:
 *
 * DashboardLayout
 *  ├── DashboardSidebar   (fixed, collapsible — desktop / tablet)
 *  ├── MobileSidebar      (left drawer — mobile)
 *  └── MainContent
 *       ├── DashboardHeader
 *       └── PageContent   ({children})
 */
export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={user} collapsed={collapsed} />

      <MobileSidebar
        user={user}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />

      {/* Main content — shifted right to make room for the fixed sidebar. */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 ease-out md:pl-64",
          collapsed && "md:pl-[76px]"
        )}
      >
        <DashboardHeader
          user={user}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
