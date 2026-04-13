# Project Management Frontend

Frontend application for project and task management built with React, TypeScript, and Vite. The app supports authentication, multi-view project planning (backlog/board/list/timeline/sprints), task details, comments, attachments, project analytics, and audit logs with permission-based routing.

## Features

- Authentication flows: sign up, login, forgot password, OTP verification
- Protected routes with auth redirect and permission guards
- Project workspace with multiple views:
  - Backlog
  - Board
  - List
  - Sprint overview
  - Timeline
- Task detail page with comments, subtasks, linked items, and attachments
- Project settings and audit logs
- Analytics dashboard for project insights
- Push notification setup using Service Worker + Web Push (VAPID)
- Theme management with Ant Design theming and light/dark color mode

## Tech Stack

- React 19 + TypeScript
- Vite 7
- React Router DOM 7
- TanStack React Query
- Ant Design 6
- Tailwind CSS 4 + Sass
- Axios for API requests
- TipTap for rich text editing
- Recharts, AntV plots for UI and visualization

## Project Structure

```text
src/
  components/        # Feature components (auth, task modal, board, backlog, etc.)
  config/            # App config and constants
  context/           # Auth, theme, project providers
  hooks/             # Reusable custom hooks
  layout/            # Main authenticated layout
  pages/             # Route-level pages
  services/          # API service modules
  styles/            # Global/editor/task styles
  types/             # Shared TypeScript types
  utils/             # Utilities (auth redirect, interceptors, notifications)
public/
  service-worker.js  # Push notification service worker
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm/yarn if you prefer, examples below use npm)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
```

Environment variable reference:

- `VITE_API_BASE_URL`: Base URL used by the frontend API clients
- `VITE_VAPID_PUBLIC_KEY`: Public VAPID key used to register browser push subscriptions

### Run Development Server

```bash
npm run dev
```

App starts on Vite default URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Type-check and build production bundle
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint
- `npm run format`: Format `src/**/*.ts` and `src/**/*.tsx` with Prettier
- `npm run commitlint`: Validate commit messages

## Routing Overview

Public routes:

- `/signup`
- `/login`
- `/forgot-password`
- `/verify-otp`
- `/invite/join`

Protected routes:

- `/for-you`
- `/edit-profile`
- `/project/:projectId/backlog`
- `/project/:projectId/board`
- `/project/:projectId/list`
- `/project/:projectId/sprints-overview`
- `/project/:projectId/timeline`
- `/project/:projectId/logs` (permission-gated)
- `/project/:projectId/analytics` (permission-gated)
- `/project/:projectId/settings` (permission-gated)
- `/task/:taskId`

## Push Notifications

Push notifications are initialized via `src/utils/setupNotification.ts` and rely on `public/service-worker.js`.

To use notifications in local/dev environments:

- Ensure backend push endpoints are available
- Configure `VITE_VAPID_PUBLIC_KEY`
- Run the app in a browser that supports Service Workers and Push API
- Grant notification permission when prompted

## Build and Deployment

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Deploy the generated `dist/` directory with your preferred static hosting solution.

## Development Notes

- React Compiler is enabled in Vite via Babel plugin configuration.
- Axios instances use `VITE_API_BASE_URL` and token-based auth headers/interceptors.
- TanStack Query client is initialized globally in the app root.

## Contributing

1. Create a feature branch from `dev`.
2. Follow existing lint/format rules.
3. Run lint/build before opening a PR.
4. Use conventional commit messages (enforced via commitlint/husky).
