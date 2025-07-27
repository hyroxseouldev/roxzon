import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

export default function CreatePostPage() {
  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/posts">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                게시글 목록으로 돌아가기
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <PlusCircle className="h-8 w-8 mr-3" />
            새 게시글 작성
          </h1>
          
          <div className="bg-zinc-900 rounded-lg p-8 text-center">
            <p className="text-zinc-400 mb-4">게시글 작성 폼이 여기에 표시됩니다.</p>
            <p className="text-sm text-zinc-500">
              게시글 작성 기능은 Phase 3에서 구현될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}