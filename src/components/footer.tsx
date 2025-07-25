import Link from "next/link";
import { Github, Instagram, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                하
              </div>
              <span className="font-bold text-xl text-foreground">하이록스</span>
            </div>
            <p className="text-sm text-muted-foreground">
              한국의 HIIT 운동 커뮤니티 플랫폼으로 함께 건강한 라이프스타일을 만들어가요.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@hirocks.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-muted-foreground hover:text-foreground transition-colors">
                  게시글
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-muted-foreground hover:text-foreground transition-colors">
                  운동 프로그램
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-muted-foreground hover:text-foreground transition-colors">
                  신고하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">약관</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">
                  커뮤니티 가이드라인
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>대한민국 서울</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 하이록스(Hirocks). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;