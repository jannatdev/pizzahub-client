"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Home, Menu as MenuIcon, PanelLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/context/auth-context";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";
import { getPageInfo } from "@/components/dashboard/sidebar";

interface DashboardHeaderProps {
  user: AuthUser;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSidebar: () => void;
}

/** "Jannatul Ferdous" → "JF" — same fallback as the sidebar avatar. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Sticky header above the page content:
 * mobile sidebar trigger · desktop collapse toggle · breadcrumb + page title ·
 * notifications · profile link.
 */
export function DashboardHeader({
  user,
  collapsed,
  onToggleCollapse,
  onOpenSidebar,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { title, section } = getPageInfo(pathname, user.role);

  const roleHome = DASHBOARD_HOME[user.role];
  const isRoleHome = pathname === roleHome;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:px-6">
      {/* Mobile: open the drawer */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-gray-600 md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open sidebar menu"
      >
        <MenuIcon className="size-5" />
      </Button>

      {/* Desktop: collapse / expand the sidebar */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden shrink-0 text-gray-600 md:inline-flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <PanelLeft className="size-5" />
      </Button>

      {/* Breadcrumb + page title */}
      <div className="min-w-0">
        {/* Home → Dashboard → current section. "Home" always links back to
            the public homepage (/). */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-1 text-xs text-gray-400">
            <li className="shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition-colors hover:text-red-600"
              >
                <Home className="size-3" />
                Home
              </Link>
            </li>

            {!isRoleHome && (
              <li className="flex shrink-0 items-center gap-1">
                <ChevronRight className="size-3 text-gray-300" aria-hidden="true" />
                <Link
                  href={roleHome}
                  className="transition-colors hover:text-red-600"
                >
                  Dashboard
                </Link>
              </li>
            )}

            {section && (
              <li className="flex min-w-0 items-center gap-1">
                <ChevronRight className="size-3 shrink-0 text-gray-300" aria-hidden="true" />
                <span className="truncate">{section}</span>
              </li>
            )}
          </ol>
        </nav>

        <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative shrink-0 text-gray-500 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {/* Placeholder unread dot — real notifications come later. */}
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Button>

        <Link
          href={`${DASHBOARD_HOME[user.role]}/profile`}
          className="flex shrink-0 items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100"
          aria-label={`${user.name} — profile settings`}
        >
          <Avatar className="size-8">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback className="bg-red-100 text-xs font-semibold text-red-700">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
