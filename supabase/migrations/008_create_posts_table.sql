-- Create posts table for Phase 3
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  topic VARCHAR(100), -- 게시글 주제/카테고리
  difficulty VARCHAR(20) CHECK (difficulty IN ('초급', '중급', '고급')),
  location VARCHAR(200), -- 운동 위치
  instagram_url VARCHAR(500), -- 인스타그램 링크
  image_urls TEXT[], -- 이미지 URLs 배열 (최대 5개)
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_topic ON posts(topic);
CREATE INDEX IF NOT EXISTS idx_posts_difficulty ON posts(difficulty);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_like_count ON posts(like_count DESC);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add some sample topics for testing
INSERT INTO posts (user_id, title, content, topic, difficulty, location, instagram_url) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    '초보자를 위한 HIIT 가이드',
    '안녕하세요! HIIT 운동을 처음 시작하는 분들을 위한 가이드입니다. 기본적인 동작들과 주의사항을 설명드리겠습니다.',
    '초보자 가이드',
    '초급',
    '서울특별시 강남구',
    'https://instagram.com/sample_hiit'
  )
ON CONFLICT DO NOTHING;