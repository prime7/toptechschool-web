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
import { Menu } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeSwitch";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/lib/utils";

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
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
          >
            Sign Out
          </button>
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
        variant="outline"
        className="text-foreground"
        onClick={() => signIn()}
      >
        Sign In
      </Button>
    );
  };

  return (
    <nav className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
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
    </nav>
  );
};

export default Navbar;
