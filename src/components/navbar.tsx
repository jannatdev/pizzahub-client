"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Pizza,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, type UserRole } from "@/context/auth-context";
import { cn } from "@/lib/utils";

/** Where each role lands after clicking "Dashboard". */
const DASHBOARD_PATH: Record<UserRole, string> = {
  customer: "/dashboard",
  vendor: "/vendor",
  admin: "/admin",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    ...(user
      ? [{ label: "Dashboard", href: DASHBOARD_PATH[user.role] }]
      : []),
  ];

  const linkClass = (href: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      pathname === href
        ? "text-red-600"
        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-red-600 text-white">
            <Pizza className="size-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-red-600">Pizza</span>
            <span className="text-orange-500">Hub</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                <Avatar className="size-9">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-red-100 font-semibold text-red-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-medium text-gray-800 lg:inline">
                  {user.name}
                </span>
                <ChevronDown className="size-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href={DASHBOARD_PATH[user.role]} />}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/profile-settings" />}>
                  <Settings className="size-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                render={<Link href="/sign-in" />}
                className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Sign In
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="flex size-10 items-center justify-center rounded-md text-gray-700 hover:bg-red-50 md:hidden">
            <MenuIcon className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col gap-6">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-1">
                    <Avatar className="size-10">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-red-100 font-semibold text-red-700">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="justify-start border-red-200 bg-white text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    render={<Link href="/sign-in" />}
                    className="border-red-200 bg-white text-red-600 hover:bg-red-50"
                  >
                    Sign In
                  </Button>
                  <Button
                    render={<Link href="/sign-up" />}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
