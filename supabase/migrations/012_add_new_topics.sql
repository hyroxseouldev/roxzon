-- Add new topics for community features
-- 파트너찾기, 티켓양도, 자유게시판, 오프라인클래스

INSERT INTO public.topics (name, description, color, icon) VALUES
('Partner Finding', '운동 파트너를 찾는 게시판', '#e11d48', 'Users'),
('Ticket Transfer', '티켓 양도 및 거래 게시판', '#f59e0b', 'Ticket'),
('Free Board', '자유롭게 소통하는 게시판', '#8b5cf6', 'MessageSquare'),
('Offline Classes', '오프라인 클래스 정보 및 후기', '#06b6d4', 'MapPin')
ON CONFLICT (name) DO NOTHING;

-- Update existing topics with better descriptions and icons
UPDATE public.topics SET 
  description = 'High-Intensity Interval Training 고강도 인터벌 운동',
  icon = 'Zap'
WHERE name = 'HIIT';

UPDATE public.topics SET 
  description = '웨이트 트레이닝 및 근력 강화 운동',
  icon = 'Dumbbell'
WHERE name = '근력운동';

UPDATE public.topics SET 
  description = '카디오 및 지구력 향상 운동',
  icon = 'Heart'
WHERE name = '유산소';

UPDATE public.topics SET 
  description = '유연성 및 마음챙김 요가 수련',
  icon = 'Flower'
WHERE name = '요가';

UPDATE public.topics SET 
  description = '체중 감량을 위한 운동 및 팁',
  icon = 'Scale'
WHERE name = '다이어트';

UPDATE public.topics SET 
  description = '집에서 할 수 있는 홈트레이닝',
  icon = 'Home'
WHERE name = '홈트레이닝';

UPDATE public.topics SET 
  description = '운동 입문자를 위한 가이드',
  icon = 'GraduationCap'
WHERE name = '초보자';

UPDATE public.topics SET 
  description = '운동과 관련된 영양 및 식단 정보',
  icon = 'Apple'
WHERE name = '영양/식단';