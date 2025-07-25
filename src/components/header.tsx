"use client";

import Link from "next/link";
import { Menu, User, Home, FileText, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl italic font-serif text-yellow-500">
              Roxzon
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>홈</span>
          </Link>
          <Link
            href="/posts"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>게시글</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Login Button */}
          <Link href="/auth">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-1"
            >
              <LogIn className="h-4 w-4" />
              <span>로그인</span>
            </Button>
          </Link>

          {/* User Menu (placeholder for authenticated state) */}
          <Button variant="ghost" size="icon" className="hidden">
            <User className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>홈</span>
                </Link>
                <Link
                  href="/posts"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>커뮤니티</span>
                </Link>
                <div className="border-t pt-4">
                  <Link href="/auth">
                    <Button variant="outline" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
