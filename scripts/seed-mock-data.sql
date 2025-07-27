-- Mock data for Roxzon HIIT Community Platform
-- This script creates 20 posts with comments and likes

-- Insert mock users first
INSERT INTO public.users (id, nickname, avatar_url, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'HIIT마스터', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', '운동좋아', 'https://images.unsplash.com/photo-1494790108755-2616b612b169?w=100', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', '피트니스걸', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440004', '근육남', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440005', '헬스퀸', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440006', '다이어터', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440007', '운동중독', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440008', '홈트족', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440009', '운동신', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440010', '피트니스코치', 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert 20 mock posts (communities table)
INSERT INTO public.communities (id, user_id, title, content, difficulty, location, instagram_link, images, likes_count, comments_count, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '초보자를 위한 HIIT 루틴', '운동 처음 시작하는 분들을 위한 간단한 HIIT 루틴입니다. 부담 없이 따라해보세요!', '초급', '서울시 강남구', '@hiit_beginner', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]', 15, 3, NOW() - INTERVAL '12 hours'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '10분 아침 운동 루틴', '바쁜 아침에도 할 수 있는 짧지만 강력한 HIIT 운동이에요!', '중급', '부산시 해운대구', '@morning_workout', '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"]', 23, 5, NOW() - INTERVAL '1 day'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '복근 집중 HIIT 30분', '여름 몸매 준비! 복근에 집중한 고강도 운동입니다.', '고급', '대구시 중구', '@abs_killer', '["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"]', 42, 8, NOW() - INTERVAL '2 days'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '하체 폭발 워크아웃', '스쿼트, 런지, 점프를 조합한 하체 강화 운동입니다.', '중급', '인천시 연수구', '@leg_day', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1549476464-37392f717541?w=400"]', 31, 6, NOW() - INTERVAL '3 days'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '전신 지방 연소 운동', '20분으로 끝내는 전신 지방 연소 HIIT! 효과 보장!', '초급', '광주시 서구', '@fatburn_queen', '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]', 28, 4, NOW() - INTERVAL '4 days'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '상체 근력 강화 HIIT', '팔굽혀펴기와 플랭크를 활용한 상체 근력 운동입니다.', '중급', '대전시 유성구', '@upper_body', '["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"]', 19, 7, NOW() - INTERVAL '5 days'),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '점심시간 5분 운동', '사무실에서도 할 수 있는 간단한 움직임들로 구성했어요.', '초급', '울산시 남구', '@office_workout', '["https://images.unsplash.com/photo-1549476464-37392f717541?w=400"]', 12, 2, NOW() - INTERVAL '6 days'),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', '홈트족을 위한 장비 없는 운동', '집에서 장비 없이도 할 수 있는 완벽한 HIIT 루틴!', '중급', '청주시 흥덕구', '@home_workout', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"]', 35, 9, NOW() - INTERVAL '7 days'),
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '칼로리 폭탄 운동', '30분에 500칼로리 태우는 극강 HIIT! 각오하고 오세요!', '고급', '천안시 동남구', '@calorie_bomb', '["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"]', 51, 12, NOW() - INTERVAL '8 days'),
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', '초보자 다이어트 운동', '운동 경험이 없어도 따라할 수 있는 다이어트 HIIT입니다.', '초급', '전주시 완산구', '@diet_starter', '["https://images.unsplash.com/photo-1549476464-37392f717541?w=400", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]', 22, 5, NOW() - INTERVAL '9 days'),
('770e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '주말 야외 운동', '공원에서 할 수 있는 HIIT 운동을 소개합니다!', '중급', '포항시 북구', '@outdoor_hiit', '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]', 18, 3, NOW() - INTERVAL '10 days'),
('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '근력과 유산소의 조화', '근력운동과 유산소를 완벽하게 조합한 운동입니다.', '고급', '창원시 의창구', '@cardio_strength', '["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"]', 39, 7, NOW() - INTERVAL '11 days'),
('770e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', '초급자를 위한 근력 운동', '웨이트 트레이닝에 입문하시는 분들을 위한 기초 운동입니다.', '초급', '구미시 원평동', '@strength_basic', '["https://images.unsplash.com/photo-1549476464-37392f717541?w=400"]', 16, 4, NOW() - INTERVAL '12 days'),
('770e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', '고강도 타바타 운동', '4분의 기적! 타바타 프로토콜로 극한 운동 경험!', '고급', '안양시 만안구', '@tabata_master', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]', 47, 11, NOW() - INTERVAL '13 days'),
('770e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', '여성을 위한 HIIT', '여성의 몸에 맞춘 HIIT 운동 프로그램입니다.', '중급', '고양시 일산서구', '@women_hiit', '["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"]', 33, 8, NOW() - INTERVAL '14 days'),
('770e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440006', '운동 후 스트레칭', 'HIIT 운동 후 꼭 필요한 스트레칭 루틴입니다.', '초급', '수원시 영통구', '@stretch_time', '["https://images.unsplash.com/photo-1549476464-37392f717541?w=400", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"]', 25, 6, NOW() - INTERVAL '15 days'),
('770e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440007', '근지구력 향상 운동', '근지구력을 기르는 HIIT 운동 프로그램입니다.', '중급', '성남시 분당구', '@endurance_up', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]', 21, 4, NOW() - INTERVAL '16 days'),
('770e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440008', '체지방 감량 특급', '빠른 체지방 감량을 위한 고강도 HIIT 운동!', '고급', '용인시 수지구', '@fat_burner', '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"]', 44, 10, NOW() - INTERVAL '17 days'),
('770e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440009', '심혈관 건강 운동', '심혈관 건강을 위한 저강도 HIIT 운동입니다.', '초급', '부천시 원미구', '@cardio_health', '["https://images.unsplash.com/photo-1549476464-37392f717541?w=400"]', 17, 3, NOW() - INTERVAL '18 days'),
('770e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '마스터 클래스 HIIT', '모든 레벨을 아우르는 완전체 HIIT 운동 프로그램!', '고급', '화성시 동탄신도시', '@hiit_master_class', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"]', 63, 15, NOW() - INTERVAL '19 days')
ON CONFLICT (id) DO NOTHING;

-- Insert mock comments
INSERT INTO public.comments (id, user_id, community_id, content, likes_count, created_at) VALUES
-- Comments for post 1
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '정말 좋은 루틴이네요! 초보자도 쉽게 따라할 수 있을 것 같아요.', 3, NOW() - INTERVAL '10 hours'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '운동 강도가 적당해서 좋네요. 감사합니다!', 2, NOW() - INTERVAL '8 hours'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '이 운동으로 3주째 하고 있는데 정말 효과 좋아요!', 5, NOW() - INTERVAL '6 hours'),
-- Comments for post 2
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '아침에 딱 좋은 운동이네요. 매일 해야겠어요!', 4, NOW() - INTERVAL '20 hours'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', '시간이 짧아서 좋아요. 바쁜 직장인에게 최고!', 6, NOW() - INTERVAL '18 hours'),
-- Comments for post 3
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', '복근 운동 효과가 정말 좋네요! 추천합니다.', 8, NOW() - INTERVAL '40 hours'),
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', '힘들지만 그만큼 효과적이에요!', 3, NOW() - INTERVAL '35 hours'),
-- More comments for various posts
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', '하체 운동 최고예요! 덕분에 다리가 튼튼해졌어요.', 7, NOW() - INTERVAL '60 hours'),
('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440005', '지방 연소 효과 실화인가요? 정말 대박!', 9, NOW() - INTERVAL '80 hours'),
('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440008', '집에서 하기 정말 좋은 운동이네요!', 5, NOW() - INTERVAL '120 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert reply comments
INSERT INTO public.comments (id, user_id, community_id, parent_id, content, likes_count, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '감사합니다! 꾸준히 하시면 분명 효과 보실 거예요.', 2, NOW() - INTERVAL '9 hours'),
('880e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', '네! 저도 매일 하고 있어요. 함께 화이팅해요!', 3, NOW() - INTERVAL '19 hours'),
('880e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', '정말요? 저도 더 열심히 해야겠네요!', 1, NOW() - INTERVAL '38 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert mock likes for posts
INSERT INTO public.likes (id, user_id, community_id, created_at) VALUES
-- Likes for various posts by different users
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '11 hours'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '10 hours'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '9 hours'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '21 hours'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '20 hours'),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '41 hours'),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '40 hours'),
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '61 hours'),
('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '81 hours'),
('990e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440008', NOW() - INTERVAL '121 hours'),
-- More likes spread across different posts
('990e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440009', NOW() - INTERVAL '5 hours'),
('990e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440009', NOW() - INTERVAL '4 hours'),
('990e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440014', NOW() - INTERVAL '2 hours'),
('990e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440018', NOW() - INTERVAL '1 hour'),
('990e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440020', NOW() - INTERVAL '30 minutes')
ON CONFLICT (user_id, community_id) DO NOTHING;

-- Insert mock comment likes
INSERT INTO public.comment_likes (id, user_id, comment_id, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '9 hours'),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '8 hours'),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '18 hours'),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '39 hours'),
('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440008', NOW() - INTERVAL '59 hours')
ON CONFLICT (user_id, comment_id) DO NOTHING;