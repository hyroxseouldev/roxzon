# 하이록스 커뮤니티 어플리케이션 기능서

## 1. 프로젝트 개요

- **프로젝트명**: 하이록스 커뮤니티 플랫폼
- **목적**: 하이록스 운동을 하는 사람들을 위한 커뮤니티 및 운동 프로그램 공유 플랫폼
- **기술 스택**: Next.js 15.4.4, Supabase, shadcn, tailwind 4.0, framer motion
- **타겟 사용자**: 하이록스 운동 참여자 및 관심자

## 2. 핵심 기능

### 2.1 사용자 인증

- **회원가입**: 이메일/비밀번호 기반 회원가입
- **로그인/로그아웃**: Supabase Auth 활용
- **프로필 관리**: 기본 프로필 정보 (닉네임, 프로필 사진)

### 2.2 게시글 기능

- **게시글 작성**: 제목, 내용, 사진 업로드 (최대 5장)
- **운동 프로그램 정보**: 난이도 선택 (초급/중급/고급), 위치, 인스타그램 링크
- **게시글 목록**: 최신순 정렬로 게시글 리스트 표시
- **게시글 상세 조회**: 개별 게시글 상세 페이지
- **게시글 수정/삭제**: 작성자만 가능

### 2.3 상호작용 기능

- **좋아요**: 게시글별 좋아요 기능 (중복 불가)
- **댓글**: 게시글에 댓글 작성/수정/삭제
- **대댓글**: 댓글에 대한 답글 기능 (1단계만)

### 2.5 운동 프로그램

- **프로그램 소개**: 하이록스 관련 운동 프로그램 게시
- **난이도 분류**: 초급(Beginner) / 중급(Intermediate) / 고급(Advanced)
- **위치 정보**: 운동 장소나 지역 정보 표시
- **소셜 연결**: 인스타그램 링크를 통한 추가 정보 제공

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

### 3.2 Posts (게시글)

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → Users.id)
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

### 3.3 Likes (좋아요)

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → Users.id)
- post_id (UUID, Foreign Key → Posts.id)
- created_at (Timestamp)
- UNIQUE(user_id, post_id)
```

### 3.4 Comments (댓글)

```sql
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key → Posts.id)
- user_id (UUID, Foreign Key → Users.id)
- parent_id (UUID, nullable, Foreign Key → Comments.id)
- content (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3.7 Storage Buckets

- **post-images**: 게시글 이미지 저장
- **profile-images**: 프로필 이미지 저장

## 4. 주요 페이지 구조

### 4.1 메인 페이지 (/)

- 최신 게시글 목록
- 통합 검색창 (헤더 고정)
- 카테고리별 필터링
- 난이도별 운동 프로그램 추천
- 간단한 하이록스 소개

### 4.2 로그인/회원가입 (/auth)

- 로그인 폼
- 회원가입 폼
- 소셜 로그인 (선택사항)

### 4.3 게시글 목록 (/posts)

- 전체 게시글 목록
- 통합 검색 기능 (제목/내용/위치)
- 고급 검색 옵션 (작성자, 날짜 범위)
- 카테고리별 필터
- 난이도별 필터 (초급/중급/고급)
- 위치별 필터
- 검색 결과 하이라이팅

### 4.4 게시글 상세 (/posts/[id])

- 게시글 내용
- 이미지 갤러리
- 운동 프로그램 정보 (난이도, 위치)
- 인스타그램 링크 (클릭 시 새 탭으로 이동)
- 좋아요 버튼
- 댓글 섹션

### 4.5 게시글 작성 (/posts/create)

- 제목/내용 입력
- 이미지 업로드
- 카테고리 선택
- 난이도 선택 (초급/중급/고급)
- 위치 입력
- 인스타그램 링크 입력 (선택사항)

### 4.8 프로필 (/profile)

- 내 게시글 목록
- 좋아요한 게시글
- 프로필 수정

## 5. API 엔드포인트

### 5.1 인증 관련

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 5.2 게시글 관련

- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/[id]` - 게시글 상세 조회
- `PUT /api/posts/[id]` - 게시글 수정
- `DELETE /api/posts/[id]` - 게시글 삭제

### 5.3 좋아요 관련

- `POST /api/posts/[id]/like` - 좋아요 토글

### 5.6 댓글 관련

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
- Server Components와 Client Components 적절히 활용
- 이미지 최적화 (next/image)
- Middleware를 통한 인증 보호
- 검색 성능 최적화 (Debouncing, 캐싱)

### 6.3 상태 관리

- Zustand 또는 Context API 활용
- 사용자 세션 관리
- 게시글 캐싱

## 7. UI/UX 고려사항

### 7.1 반응형 디자인

- 모바일 우선 설계
- 태블릿, 데스크톱 대응

### 7.2 사용자 경험

- 로딩 상태 표시
- 에러 처리 및 알림
- 무한 스크롤 (게시글 목록)
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
- 검색 성능 최적화 (Full-text search, 인덱싱)

## 9. 개발 우선순위

### Phase 1 (MVP)

1. 사용자 인증 시스템
2. 기본 게시글 CRUD
3. 간단한 UI 구성

### Phase 2

1. 좋아요 기능
2. 댓글 시스템
3. 이미지 업로드

### Phase 3

1. 대댓글 기능
2. 프로필 관리

이 기능서를 바탕으로 단계별로 개발을 진행하시면 효율적인 하이록스 커뮤니티 플랫폼을 구축할 수 있을 것입니다.
