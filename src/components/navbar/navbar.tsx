"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeSwitch";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Navbar = ({ session }: { session: Session | null }) => {
  const navItems = [
    { name: "TTS", href: "/" },
    { name: "Startup", href: "/startup" },
    { name: "Practice", href: "/practice" },
    { name: "Blog", href: "/blog" },
  ];

  const profileItems = [
    { name: "Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Practice", href: "/practice" },
    { name: "Resume", href: "/resume" },
    { name: "Resume Editor", href: "/resume/editor" },
    { name: "Job", href: "/job" },
    { name: "Recommendations", href: "/recommendations" },
  ];

  const AuthButton = ({ isMobile = false }) => {
    if (session) {
      return isMobile ? (
        <div className="flex flex-col space-y-4">
          {profileItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className="border-2 border-border">
              <AvatarImage src={session.user?.image || ""} alt="@shadcn" />
              <AvatarFallback>{getInitialsFromName(session.user?.name || "")}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border border-border">
            <DropdownMenuLabel>Howdy! {session.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {profileItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild className="cursor-pointer">
                <Link href={item.href}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        onClick={() => signIn()}
        className={cn(
          "bg-gradient-to-r from-emerald-500 to-teal-600",
          "hover:from-emerald-600 hover:to-teal-700",
          "text-white font-medium",
          "px-6 py-2 h-9",
          "rounded-full",
          "shadow-md hover:shadow-xl",
          "transition-all duration-300"
        )}
      >
        Sign In
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <Link
              href="/"
              className={cn(
                "text-2xl font-bold tracking-tighter select-none",
                "bg-gradient-to-r from-emerald-600 to-teal-600",
                "bg-clip-text text-transparent",
                "hover:from-emerald-500 hover:to-teal-500",
                "transition-all duration-300",
                "flex items-center"
              )}
            >
              <span className="text-foreground">Toptech</span>school
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="hidden sm:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          "group inline-flex w-max items-center justify-center px-4 py-2",
                          "text-sm font-medium uppercase tracking-wide",
                          "relative transition-all duration-300",
                          "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400",
                          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full",
                          "after:origin-left after:scale-x-0",
                          "after:bg-gradient-to-r after:from-emerald-500 after:to-teal-500",
                          "after:transition-transform after:duration-300 hover:after:scale-x-100",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                          "disabled:pointer-events-none disabled:opacity-50"
                        )}
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <ThemeToggle />
              <AuthButton />
            </div>

            <div className="flex items-center sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background">
                  <nav className="flex flex-col h-full">
                    {session && (
                      <div className="mb-6 pb-4 border-b border-border">
                        <span className="text-sm font-medium">Howdy! {session.user?.name}</span>
                      </div>
                    )}
                    <div className="flex flex-col space-y-4 flex-grow">
                      {navItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          {item.name}
                        </a>
                      ))}
                      <AuthButton isMobile={true} />
                    </div>
                    <div className="pt-4 mt-auto border-t border-border">
                      <ThemeToggle />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
