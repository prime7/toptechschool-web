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
import {  Menu } from "lucide-react";
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

  const AuthButton = () => {
    if (session) {
      return (
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
            <DropdownMenuItem asChild className="cursor-pointer"><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer"><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer"><Link href="/resume">Resume</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer"><Link href="/job">Job</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <Button
          variant="outline"
          className="text-foreground"
          onClick={() => signIn()}
        >
          Sign In
        </Button>
      );
    }
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
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <AuthButton />
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
