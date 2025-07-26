"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    difficulty: "",
    location: "",
    instagramLink: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert("이미지는 최대 5개까지 업로드할 수 있습니다.");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.difficulty || !formData.location) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically submit to your API
      console.log("Form data:", formData);
      console.log("Images:", images);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("게시글이 성공적으로 작성되었습니다!");
      router.push("/communities");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/communities">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                목록으로 돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                게시글 작성
              </h1>
              <p className="text-muted-foreground mt-1">
                하이록스 커뮤니티에 운동 프로그램을 공유해보세요
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="운동 프로그램 제목을 입력해주세요"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Difficulty and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">운동 난이도 *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="초급">초급</SelectItem>
                      <SelectItem value="중급">중급</SelectItem>
                      <SelectItem value="고급">고급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">지역 *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleSelectChange("location", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="강남구">강남구</SelectItem>
                      <SelectItem value="강동구">강동구</SelectItem>
                      <SelectItem value="강북구">강북구</SelectItem>
                      <SelectItem value="강서구">강서구</SelectItem>
                      <SelectItem value="관악구">관악구</SelectItem>
                      <SelectItem value="광진구">광진구</SelectItem>
                      <SelectItem value="구로구">구로구</SelectItem>
                      <SelectItem value="금천구">금천구</SelectItem>
                      <SelectItem value="노원구">노원구</SelectItem>
                      <SelectItem value="도봉구">도봉구</SelectItem>
                      <SelectItem value="동대문구">동대문구</SelectItem>
                      <SelectItem value="동작구">동작구</SelectItem>
                      <SelectItem value="마포구">마포구</SelectItem>
                      <SelectItem value="서대문구">서대문구</SelectItem>
                      <SelectItem value="서초구">서초구</SelectItem>
                      <SelectItem value="성동구">성동구</SelectItem>
                      <SelectItem value="성북구">성북구</SelectItem>
                      <SelectItem value="송파구">송파구</SelectItem>
                      <SelectItem value="양천구">양천구</SelectItem>
                      <SelectItem value="영등포구">영등포구</SelectItem>
                      <SelectItem value="용산구">용산구</SelectItem>
                      <SelectItem value="은평구">은평구</SelectItem>
                      <SelectItem value="종로구">종로구</SelectItem>
                      <SelectItem value="중구">중구</SelectItem>
                      <SelectItem value="중랑구">중랑구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Instagram Link */}
              <div className="space-y-2">
                <Label htmlFor="instagramLink">인스타그램 링크 (선택)</Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  placeholder="https://instagram.com/your_account"
                  value={formData.instagramLink}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운동 프로그램 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="운동 프로그램에 대한 자세한 설명을 입력해주세요.&#10;&#10;예시:&#10;- 운동 구성 및 순서&#10;- 각 동작별 세트 수와 반복 횟수&#10;- 주의사항 및 팁&#10;- 예상 운동 시간 등"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  운동 프로그램의 구성, 방법, 주의사항 등을 자세히 작성해주세요.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>  
              <CardTitle>이미지 업로드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  운동 동작이나 자세를 보여주는 이미지를 업로드해주세요. (최대 5개)
                </p>

                {/* Image Upload Area */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-center mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <div className="aspect-square">
                      <label className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                        <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground text-center">
                          이미지 추가
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/communities">
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "작성 중..." : "게시글 작성"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}