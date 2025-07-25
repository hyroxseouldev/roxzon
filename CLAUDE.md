# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Roxzon (하이록스)** - a Korean community platform for HIIT exercise enthusiasts built with Next.js 15.4.4, React 19, and TypeScript. The application serves as a social platform where users can share workout programs, interact through posts, comments, and likes.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
pnpm dev            # Alternative with pnpm

# Production
npm run build       # Build for production
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Tech Stack & Architecture

- **Framework**: Next.js 15.4.4 with App Router
- **UI Framework**: React 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS 4.0 with shadcn/ui components
- **Component Library**: Radix UI primitives with 50+ pre-built components
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (planned integration)
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout with Geist fonts
│   └── page.tsx        # Home page
├── components/
│   └── ui/             # 50+ shadcn/ui components (buttons, forms, dialogs, etc.)
├── hooks/
│   └── use-mobile.ts   # Mobile breakpoint detection (768px)
└── lib/
    └── utils.ts        # Utility functions (cn for className merging)
```

## UI Component System

The project uses shadcn/ui with "new-york" style variant. All components are in `src/components/ui/` and include:
- Form components (Button, Input, Select, Checkbox, etc.)  
- Layout components (Card, Sheet, Sidebar, etc.)
- Feedback components (Alert, Toast via Sonner, etc.)
- Navigation components (Breadcrumb, Menubar, etc.)
- Data display (Table, Charts via Recharts, etc.)

**Component Usage**: Import from `@/components/ui/[component-name]` using the configured path aliases.

## Code Style Guidelines (from .cursorrules)

- Use **early returns** for better readability
- **Tailwind classes only** - avoid CSS or style tags
- **Descriptive naming**: Event handlers prefixed with "handle" (handleClick, handleKeyDown)
- **const over function**: Use `const toggle = () =>` with TypeScript types
- **Accessibility first**: Include tabindex, aria-label, keyboard events
- **DRY principle**: Don't repeat yourself, create reusable components

## Key Features (from spec/first-requirements.md)

The application is designed as a Korean HIIT community with:
- User authentication via Supabase Auth
- Post creation with image uploads (up to 5 images)
- Exercise difficulty levels (초급/중급/고급 - Beginner/Intermediate/Advanced)
- Location and Instagram link integration
- Like/comment system with nested replies
- Mobile-first responsive design

## Database Schema (Planned)

- **Users**: Profile management with nickname and avatar
- **Posts**: Content with images, difficulty, location, Instagram links
- **Likes**: User-post relationships (unique constraint)
- **Comments**: Nested comments with parent_id structure

## Path Aliases

Configure in components.json:
- `@/components` → src/components
- `@/lib` → src/lib  
- `@/hooks` → src/hooks
- `@/ui` → src/components/ui

## Development Notes

- Uses **Turbopack** for faster development builds
- **Mobile breakpoint**: 768px (defined in use-mobile.ts)
- **Font system**: Geist Sans and Geist Mono via next/font
- **CSS Variables**: Enabled for theme customization
- **TypeScript**: Strict mode enabled with proper type definitions