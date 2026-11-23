
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Pizza,
  Settings,
} from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

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

import { type UserRole } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";
import { toast } from "sonner";

import ProfileInfoDialog from "../profile-update-dialogue";

type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: UserRole;
};

interface UserDropdownProps {
  user: SessionUser;
  onProfileClick: () => void;
  onLogout: () => void;
  onDashboard: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Declare this component OUTSIDE Navbar
function UserDropdown({
  user,
  onProfileClick,
  onLogout,
  onDashboard,
}: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 gap-2 px-2"
        )}
      >
        <Avatar className="size-8">
          {user.image && (
            <AvatarImage src={user.image} alt={user.name} />
          )}

          <AvatarFallback className="bg-red-100 text-xs font-semibold text-red-700">
            {getInitials(user.name || "User")}
          </AvatarFallback>
        </Avatar>

        <span className="max-w-28 truncate text-sm font-medium">
          {user.name}
        </span>

        <ChevronDown className="size-4 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-semibold">
            {user.name}
          </span>

          <span className="block truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={onDashboard}
        >
          <LayoutDashboard className="size-4 text-red-500" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={onProfileClick}
        >
          <Settings className="size-4 text-red-500" />
          Profile Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={onLogout}
        >
          <LogOut className="size-4 text-red-500" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { data: session } = useSession();

  const user = session?.user as SessionUser | undefined;

  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Log out is success!");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleDashboard = () => {
    router.push(DASHBOARD_HOME[user?.role ?? "customer"]);
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/browse-menu" },
    { label: "Contact", href: "/Contact" },
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <UserDropdown
              user={user}
              onProfileClick={() => setProfileOpen(true)}
              onLogout={handleLogout}
              onDashboard={handleDashboard}
            />
          ) : (
            <>
              <Button
                variant="outline"
                render={<Link href="/sign-in" />}
                nativeButton={false}
                className="border border-red-600"
              >
                Sign In
              </Button>

              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="flex size-10 items-center justify-center rounded-md text-gray-700 hover:bg-red-50 md:hidden">
            <MenuIcon className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-72 flex-col gap-4"
          >
            <SheetHeader>
              <SheetTitle>PizzaHub Menu</SheetTitle>

              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>
            </SheetHeader>

            {/* Mobile Navigation */}
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

            {/* Mobile Auth */}
            <div className="border-t pt-4">
              {user ? (
                <UserDropdown
                  user={user}
                  onProfileClick={() => setProfileOpen(true)}
                  onLogout={handleLogout}
                  onDashboard={handleDashboard}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    render={<Link href="/sign-in" />}
                    nativeButton={false}
                    className="w-full border-red-600"
                  >
                    Sign In
                  </Button>

                  <Button
                    render={<Link href="/sign-up" />}
                    nativeButton={false}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* One Profile Dialog for Desktop and Mobile */}
      {user && (
        <ProfileInfoDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          name={user.name}
          email={user.email}
          image={user.image}
        />
      )}
    </header>
  );
}
