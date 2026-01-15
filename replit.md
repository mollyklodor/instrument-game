# Musical Instrument Game

## Overview

A kid-friendly educational game where players identify musical instruments using voice recognition. Players see an instrument image and speak its name into the microphone to score points. The app features playful animations, audio feedback, a leaderboard system, and celebration effects for correct answers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for playful transitions
- **Build Tool**: Vite with custom plugins for Replit integration

Key frontend features:
- Browser-native Speech Recognition API for voice input
- Web Audio API for success/error sound feedback
- Canvas Confetti for celebration effects
- Responsive design with mobile detection hook

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: REST endpoints with Zod validation
- **Build**: esbuild for production bundling

The server handles:
- Static file serving in production
- Vite dev server integration in development
- Score persistence and leaderboard API

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Single `scores` table tracking player names, scores, and timestamps
- **Migrations**: Managed via `drizzle-kit push`

### Shared Code Structure
The `shared/` directory contains:
- `schema.ts`: Database table definitions and Zod schemas
- `routes.ts`: API route definitions with type-safe request/response schemas

This pattern enables full-stack type safety between client and server.

### API Design
Two endpoints for score management:
- `GET /api/scores` - Retrieve top 10 scores, ordered by score descending
- `POST /api/scores` - Submit a new score with player name validation

The API uses Zod for input validation and returns structured error responses.

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Connection pooling with `pg` driver
- Session storage with `connect-pg-simple` (available but not currently used)

### Third-Party Libraries
- **UI Components**: Radix UI primitives (dialog, popover, tabs, etc.)
- **Form Handling**: React Hook Form with Zod resolvers
- **Date Utilities**: date-fns
- **Animations**: Framer Motion, canvas-confetti

### Browser APIs
- Speech Recognition (webkit prefixed fallback)
- AudioContext for sound generation
- No external audio files required

### Asset Management
Instrument images stored in `attached_assets/generated_images/` directory with Vite aliased as `@assets`.