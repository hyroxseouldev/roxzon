# 하이록스 커뮤니티 어플리케이션 기능서

## 1. 프로젝트 개요

- **프로젝트명**: 하이록스 커뮤니티 플랫폼
- **목적**: 하이록스 운동을 하는 사람들을 위한 커뮤니티 및 운동 프로그램 공유 플랫폼
- **기술 스택**: Next.js 15.4.4, Supabase, shadcn, tailwind 4.0, framer motion, react query
- **타겟 사용자**: 하이록스 운동 참여자 및 관심자

## 2. 핵심 기능

### 2.1 사용자 인증

- **회원가입**: 이메일/비밀번호 기반 회원가입
- **로그인/로그아웃**: Supabase Auth 활용
- **프로필 관리**: 기본 프로필 정보 (닉네임, 프로필 사진)

### 2.2 게시글 기능

- **게시글 작성**: 제목, 내용, 사진 업로드 최대 1장
- **게시글 목록**: 최신순 정렬로 게시글 리스트 표시
- **게시글 상세 조회**: 개별 게시글 상세 페이지
- **게시글 수정/삭제**: 작성자만 가능
- 토픽을 가지고 있음.

### 2.3 상호작용 기능

- **좋아요**: 게시글별 좋아요 기능 (중복 불가)
- **댓글**: 게시글에 댓글 작성/수정/삭제
- **대댓글**: 댓글에 대한 답글 기능 (1단계만)

## 3. 데이터베이스 구조

### 3.1 Users (사용자)

```sql
- id (UUID, Primary Key)
- email (String, Unique)
- nickname (String)
- profile_image (String, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3.2 Topics (토픽)

```sql
- id (UUID, Primary Key)
- name (String, Unique) // 토픽명 (예: 기초동작, 코어운동, 상체운동, 하체운동, 카디오, 스트레칭, 부상예방, 운동팁, 식단, 장비리뷰)
- description (Text, nullable) // 토픽 설명
- color (String, nullable) // 토픽 색상 (UI에서 구분용)
- is_active (Boolean, default: true) // 활성화 상태
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3.3 Posts (게시글)

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → Users.id)
- topic_id (UUID, Foreign Key → Topics.id)
- title (String)
- content (Text)
- images (JSON Array, nullable)
- category (String) // general, program, tip 등
- difficulty (String, nullable) // beginner, intermediate, advanced
- location (String, nullable) // 운동 장소/지역
- instagram_link (String, nullable) // 인스타그램 링크
- likes_count (Integer, default: 0)
- comments_count (Integer, default: 0)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3.4 Likes (좋아요)

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → Users.id)
- post_id (UUID, Foreign Key → Posts.id)
- created_at (Timestamp)
- UNIQUE(user_id, post_id)
```

### 3.5 Comments (댓글)

```sql
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key → Posts.id)
- user_id (UUID, Foreign Key → Users.id)
- parent_id (UUID, nullable, Foreign Key → Comments.id)
- content (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3.6 Storage Buckets

- **post-images**: 게시글 이미지 저장
- **profile-images**: 프로필 이미지 저장

## 4. 주요 페이지 구조

### 4.1 메인 페이지 (/)

- 히어로 섹션

### 4.2 로그인/회원가입 (/login)

- 구글 로그인 구현

### 4.3 게시글 목록 (/posts)

- 전체 게시글 목록
- 토픽별 필터 (기초동작, 코어운동, 상체운동 등)
- 누르면 게시글로 이동

### 4.4 게시글 상세 (/posts/[id])

- 게시글 내용
- 이미지
- 인스타그램 링크 (클릭 시 새 탭으로 이동)
- 좋아요 버튼
- 댓글 섹션

### 4.5 게시글 작성 (/posts/create)

- 제목/내용 입력
- 이미지 업로드
- 토픽 선택 (기초동작, 코어운동, 상체운동 등)

### 4.8 프로필 (/profile)

- 내 게시글 목록
- 좋아요한 게시글
- 프로필 수정

## 5. API 엔드포인트

### 5.1 인증 관련

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 5.2 토픽 관련

- `GET /api/topics` - 토픽 목록 조회
- `POST /api/topics` - 토픽 생성 (관리자만)
- `PUT /api/topics/[id]` - 토픽 수정 (관리자만)
- `DELETE /api/topics/[id]` - 토픽 삭제 (관리자만)

### 5.3 게시글 관련

- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/[id]` - 게시글 상세 조회
- `PUT /api/posts/[id]` - 게시글 수정
- `DELETE /api/posts/[id]` - 게시글 삭제

### 5.4 좋아요 관련

- `POST /api/posts/[id]/like` - 좋아요 토글

### 5.5 댓글 관련

- `GET /api/posts/[id]/comments` - 댓글 목록 조회
- `POST /api/posts/[id]/comments` - 댓글 작성
- `PUT /api/comments/[id]` - 댓글 수정
- `DELETE /api/comments/[id]` - 댓글 삭제

## 6. 기술적 구현 요소

### 6.1 Supabase 설정

- 데이터베이스 테이블 생성
- Row Level Security (RLS) 정책 설정
- Storage 버킷 생성 및 정책 설정
- 실시간 구독 설정 (댓글, 좋아요)

### 6.2 Next.js 구조

- App Router 사용
- Client Components 적절히 활용
- 이미지 최적화 (next/image)

### 6.3 상태 관리

- Zustand 활용
- 사용자 세션 관리
- useQuery 를 사용한 데이터 캐싱

## 7. UI/UX 고려사항

### 7.1 반응형 디자인

- 모바일 우선 설계
- 태블릿, 데스크톱 대응

### 7.2 사용자 경험

- 로딩 상태 표시
- 에러 처리 및 알림
- 데이터 페칭 실패시 유저에게 안내하는 화면을 작성
- 이미지 lazy loading

## 8. 보안 및 성능

### 8.1 보안

- SQL 인젝션 방지 (Supabase 기본 제공)
- XSS 방지
- 이미지 업로드 검증
- 사용자 권한 검증

### 8.2 성능

- 이미지 압축 및 최적화
- 페이지네이션
- 캐싱 전략
- 데이터베이스 인덱싱

## 9. 개발 우선순위

### Phase 1 (MVP)

1. 사용자 인증 시스템
2. 기본 게시글 CRUD
3. 간단한 UI 구성

### Phase 2

1. 좋아요 기능
2. 댓글 시스템
3. 이미지 업로드
4. 토픽별 필터링

### Phase 3

1. 대댓글 기능
2. 프로필 관리

이 기능서를 바탕으로 단계별로 개발을 진행하시면 효율적인 하이록스 커뮤니티 플랫폼을 구축할 수 있을 것입니다.
