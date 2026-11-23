
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  CreditCard,
  LayoutDashboard,
  Pizza,
  PlusCircle,
  Receipt,
  Settings,
  ShoppingBag,
  Utensils,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { UserRole } from "@/context/auth-context";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";
import { PremiumBadge } from "@/components/premium-badge";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/type/auth";

/* -------------------------------------------------------------------------- */
/*                              Role-based navigation                         */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: Record<UserRole, NavSection[]> = {
  customer: [
    {
      title: "Overview",
      items: [
        {
          label: "Overview",
          href: DASHBOARD_HOME.customer,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          label: "My Orders",
          href: "/dashboard/customer/orders",
          icon: ShoppingBag,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile Settings",
          href: "/dashboard/customer/profile",
          icon: Settings,
        },
      ],
    },
  ],

  vendor: [
    {
      title: "Overview",
      items: [
        {
          label: "Overview",
          href: DASHBOARD_HOME.vendor,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Menu Management",
      items: [
        {
          label: "My Menu Items",
          href: "/dashboard/vendor/menu/ManageMenu",
          icon: Utensils,
        },
        {
          label: "Add Menu Item",
          href: "/dashboard/vendor/menu/AddMenu",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          label: "Customer Orders",
          href: "/dashboard/vendor/orders",
          icon: ShoppingBag,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Subscription",
          href: "/dashboard/vendor/subscription",
          icon: CreditCard,
        },
        {
          label: "Profile Settings",
          href: "/dashboard/vendor/profile",
          icon: Settings,
        },
      ],
    },
  ],

  admin: [
    {
      title: "Overview",
      items: [
        {
          label: "Overview",
          href: DASHBOARD_HOME.admin,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Manage Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          label: "Manage Menu Items",
          href: "/dashboard/admin/menu",
          icon: Utensils,
        },
      ],
    },
    {
      title: "Financial",
      items: [
        {
          label: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: Receipt,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile Settings",
          href: "/dashboard/admin/profile",
          icon: Settings,
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                              Page information                              */
/* -------------------------------------------------------------------------- */

export function getPageInfo(
  pathname: string,
  role: UserRole
): { title: string; section: string | null } {
  const sections = navigation[role];

  for (const section of sections) {
    for (const item of section.items) {
      if (pathname === item.href) {
        return {
          title: item.label,
          section: section.title,
        };
      }
    }
  }

  let closest: {
    item: NavItem;
    section: NavSection;
  } | null = null;

  for (const section of sections) {
    for (const item of section.items) {
      const isParent = pathname.startsWith(`${item.href}/`);

      if (
        isParent &&
        (!closest || item.href.length > closest.item.href.length)
      ) {
        closest = { item, section };
      }
    }
  }

  if (closest) {
    return {
      title: closest.item.label,
      section: closest.section.title,
    };
  }

  return {
    title: "Dashboard",
    section: null,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/* -------------------------------------------------------------------------- */
/*                             Sidebar brand                                   */
/* -------------------------------------------------------------------------- */

function SidebarBrand({ showText }: { showText: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex h-16 shrink-0 items-center gap-2.5 bg-red-50/25 px-4",
        !showText && "justify-center px-0"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-200">
        <Pizza className="size-5" />
      </span>

      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-red-600">Pizza</span>
          <span className="text-orange-500">Hub</span>
        </span>
      )}

      {!showText && (
        <span className="sr-only">PizzaHub home</span>
      )}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sidebar profile                                 */
/* -------------------------------------------------------------------------- */

function SidebarProfile({
  user,
  showText,
  isPremium,
}: {
  user: AuthUser;
  showText: boolean;
  isPremium: boolean;
}) {
  const avatar = (
    <Avatar className="size-9 shrink-0">
      {user.image ? (
        <AvatarImage src={user.image} alt={user.name} />
      ) : null}

      <AvatarFallback className="bg-red-100 text-sm font-semibold text-red-700">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );

  if (!showText) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span className="flex justify-center" />}
        >
          {avatar}
        </TooltipTrigger>

        <TooltipContent side="right">
          {user.name} · {roleLabel(user.role)}
          {isPremium ? " · Premium" : ""}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-3 border-b px-4 pb-4">
      {avatar}

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {user.name}
        </p>

        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex w-fit rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
            {roleLabel(user.role)}
          </span>

          {isPremium && <PremiumBadge />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sidebar link                                    */
/* -------------------------------------------------------------------------- */

function SidebarLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const linkClass = cn(
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none",
    active
      ? "bg-red-50 text-red-600"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100",
    collapsed && "justify-center px-0"
  );

  const content = (
    <>
      <item.icon
        className={cn(
          "size-5 shrink-0",
          active
            ? "text-red-600"
            : "text-gray-400 group-hover:text-gray-600"
        )}
      />

      {collapsed ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <span className="truncate">{item.label}</span>
      )}
    </>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={item.href}
              className={linkClass}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            />
          }
        >
          {content}
        </TooltipTrigger>

        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={item.href}
      className={linkClass}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sidebar navigation                              */
/* -------------------------------------------------------------------------- */

function SidebarNav({
  user,
  collapsed,
  onNavigate,
}: {
  user: AuthUser;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard navigation"
      className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4"
    >
      {navigation[user.role].map((section) => (
        <div key={section.title}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              {section.title}
            </p>
          )}

          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <SidebarLink
                  item={item}
                  active={pathname === item.href}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sidebar body                                   */
/* -------------------------------------------------------------------------- */

function SidebarBody({
  user,
  collapsed,
  onNavigate,
  isPremium,
}: {
  user: AuthUser;
  collapsed: boolean;
  onNavigate?: () => void;
  isPremium: boolean;
}) {
  return (
    <TooltipProvider delay={0}>
      <div className="flex h-full flex-col">
        <SidebarBrand showText={!collapsed} />

        <SidebarProfile
          user={user}
          showText={!collapsed}
          isPremium={isPremium}
        />

        <SidebarNav
          user={user}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </div>
    </TooltipProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Desktop sidebar                                */
/* -------------------------------------------------------------------------- */

interface DashboardSidebarProps {
  user: AuthUser;
  collapsed: boolean;
  isPremium: boolean;
}

export function DashboardSidebar({
  user,
  collapsed,
  isPremium,
}: DashboardSidebarProps) {
  return (
    <aside
      aria-label="Dashboard sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden border-r bg-white transition-[width] duration-200 ease-out md:flex md:flex-col",
        collapsed ? "w-19" : "w-64"
      )}
    >
      <SidebarBody
        user={user}
        collapsed={collapsed}
        isPremium={isPremium}
      />
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Mobile sidebar                                */
/* -------------------------------------------------------------------------- */

interface MobileSidebarProps {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPremium: boolean;
}

export function MobileSidebar({
  user,
  open,
  onOpenChange,
  isPremium,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 gap-0 p-0 sm:max-w-xs">
        <SheetHeader className="sr-only">
          <SheetTitle>PizzaHub dashboard menu</SheetTitle>
          <SheetDescription>
            Navigation for your dashboard
          </SheetDescription>
        </SheetHeader>

        <SidebarBody
          user={user}
          collapsed={false}
          isPremium={isPremium}
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
