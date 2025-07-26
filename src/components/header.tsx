"use client";

import Link from "next/link";
import { Menu, User, Home, FileText, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const { user, loading, signOut, isAuthenticated } = useAuth();

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
            href="/communities"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>커뮤니티</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.charAt(0) || 
                       user.user_metadata?.name?.charAt(0) || 
                       user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/communities" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>커뮤니티</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>로그인</span>
              </Button>
            </Link>
          )}

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
                  href="/communities"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>커뮤니티</span>
                </Link>
                <div className="border-t pt-4">
                  {isAuthenticated && user ? (
                    <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="h-4 w-4 mr-2" />
                        로그인
                      </Button>
                    </Link>
                  )}
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
