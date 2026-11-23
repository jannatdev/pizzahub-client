
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Pizza,
  Settings,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";



import {
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Log out is success!");
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleDashboard = () => {
    if (!user) return;

    router.push(DASHBOARD_HOME[user.role ?? "customer"]);
  };

  const handleProfile = () => {
    setProfileOpen(true);
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/browse-menu" },
    { label: "Contact", href: "/contact" },
  ];

  const linkClass = (href: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      pathname === href
        ? "text-red-600"
        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
    );

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b bg-white">
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

          {/* Desktop Authentication */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
             
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-md px-2 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Avatar className="size-7">
                    {user.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user.name}
                      />
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

                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="z-[100] w-56 bg-white"
                >

                  <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                    <span className="block truncate text-sm font-semibold">
                      {user.name}
                    </span>

                    <span className="block truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>

                  </DropdownMenuGroup>
                

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={handleDashboard}>
                    <LayoutDashboard className="mr-2 size-4 text-red-500" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={handleProfile}>
                    <Settings className="mr-2 size-4 text-red-500" />
                    Profile Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            ) : (
              <>
                <Button
                  variant="outline"
                  render={<Link href="/sign-in" />}
                  nativeButton={false}
                  className="border-red-600"
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

          {/* Mobile Navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger >
              <Button
                type="button"
                variant="ghost"
                className="flex size-10 items-center justify-center md:hidden"
              >
                <MenuIcon className="size-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-72 flex-col gap-4">
              <SheetHeader>
                <SheetTitle>PizzaHub Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <SheetClose  key={link.href}>
                    <Link
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
                  </SheetClose>
                ))}
              </nav>

              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="size-9">
                        {user.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user.name}
                          />
                        )}

                        <AvatarFallback className="bg-red-100 text-red-600">
                          {getInitials(user.name || "User")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setMobileOpen(false);
                        handleDashboard();
                      }}
                    >
                      <LayoutDashboard className="size-4 text-red-500" />
                      Dashboard
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setMobileOpen(false);
                        handleProfile();
                      }}
                    >
                      <Settings className="size-4 text-red-500" />
                      Profile Settings
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="size-4 text-red-500" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SheetClose>
                      <Button
                        variant="outline"
                        render={<Link href="/sign-in" />}
                        nativeButton={false}
                        className="w-full border-red-600"
                      >
                        Sign In
                      </Button>
                    </SheetClose>

                    <SheetClose>
                      <Button
                        render={<Link href="/sign-up" />}
                        nativeButton={false}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Sign Up
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Profile Dialog */}
      {user && (
        <ProfileInfoDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          name={user.name}
          email={user.email}
          image={user.image}
        />
      )}
    </>
  );
}
