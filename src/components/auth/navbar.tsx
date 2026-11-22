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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import {  type UserRole } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";

/**
 * Better Auth's client types only expose the core user fields. `role` is
 * declared server-side (see `user.additionalFields` in src/lib/auth.ts), so it
 * must be declared here. It stays optional because the DB field is not required.
 */
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

  // Cast to SessionUser: `role` exists on the stored user but not on Better
  // Auth's inferred client type. Absent role falls back to "customer".
  const user = session?.user as SessionUser | undefined;
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth sign-out — clears the session cookie on the server and the
  // `useSession` subscription updates this Navbar immediately.
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/browse-menu" },
    
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
              {/* The trigger renders a <button>, so it is styled directly
                  instead of nesting another <Button> inside it. */}
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-9 gap-2 px-2"
                )}
              >
                <Avatar className="size-7">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-red-100 text-xs font-semibold text-red-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
                  {user.name}
                </span>

                <ChevronDown className="size-4 opacity-60" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* Base UI: GroupLabel must live inside a Group, otherwise the
                    menu throws "MenuGroupContext is missing" when it opens. */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(DASHBOARD_HOME[user.role ?? "customer"])
                    }
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `${DASHBOARD_HOME[user.role ?? "customer"]}/profile`
                      )
                    }
                  >
                    <Settings className="size-4" />
                    Profile Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
            <Button
                variant="outline"
                render={<Link href="/sign-in" />}
                // The root element is an <a>, not a <button>.
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

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="flex size-10 items-center justify-center rounded-md text-gray-700 hover:bg-red-50 md:hidden">
            <MenuIcon className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col gap-2">
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

            <div className=" flex flex-col gap-2 border-t pt-4 -mt-5">
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
                       <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="justify-start border-red-200 bg-white text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
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
                nativeButton={false}
              >
                Sign In
              </Button>

              <Button render={<Link href="/sign-up" />} nativeButton={false}>
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
