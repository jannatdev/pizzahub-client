
"use client";

import { useState, type ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import {
  DashboardSidebar,
  MobileSidebar,
} from "@/components/dashboard/sidebar";
import type { AuthUser } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  user: AuthUser;
  children: ReactNode;
}

export function DashboardLayout({
  user,
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPremium = user.isPremium ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        user={user}
        collapsed={collapsed}
        isPremium={isPremium}
      />

      <MobileSidebar
        user={user}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        isPremium={isPremium}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 ease-out md:pl-64",
          collapsed && "md:pl-19"
        )}
      >
        <DashboardHeader
          user={user}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
