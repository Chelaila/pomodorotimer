# Pomodoro Timer

Full-stack Pomodoro Timer application with task management, configurable timer presets, YouTube playlist integration and theme customization.

## Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite 6** (dev server / bundler)
- **React Router DOM 6**
- **Tailwind CSS 4** + PostCSS / Autoprefixer
- **Axios** (HTTP client)
- **Nginx** (production static serving via Docker)

### Backend
- **NestJS 11** (Node.js framework)
- **TypeScript 5**
- **TypeORM 0.3**
- **MySQL 8** (`mysql2` driver)
- **@nestjs/event-emitter** (in-app events)
- **uuid**

### Infrastructure
- **Docker** + **Docker Compose** (frontend, backend, MySQL)
- **MySQL 8** persisted via named volume

## Project Structure

```
pomodorotimer/
├── docker-compose.yml          # Orchestrates frontend + backend + mysql
│
├── backend/                    # NestJS API (port 3001)
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── docker/                 # Backend-specific Docker assets
│   ├── sql/                    # Schema bootstrap scripts
│   │   ├── create_tasks_table.sql
│   │   └── create_timer_configs_table.sql
│   ├── test/                   # e2e / unit tests
│   └── src/
│       ├── main.ts             # Bootstrap
│       ├── app.module.ts
│       ├── app.controller.ts
│       ├── app.service.ts
│       ├── config/             # TypeORM / app configuration
│       ├── seeder/             # DB seeders
│       ├── tasks/              # Task CRUD module
│       │   ├── entities/
│       │   ├── tasks.controller.ts
│       │   ├── tasks.module.ts
│       │   ├── tasks.service.ts
│       │   └── task.interface.ts
│       ├── timer/              # Timer + timer config module
│       │   ├── entities/
│       │   ├── timer.controller.ts
│       │   ├── timer.service.ts
│       │   ├── timer-config.controller.ts
│       │   ├── timer-config.service.ts
│       │   └── timer.module.ts
│       ├── sessions/           # Pomodoro session tracking
│       │   ├── entities/
│       │   ├── sessions.controller.ts
│       │   ├── sessions.module.ts
│       │   └── sessions.service.ts
│       └── playlist/           # YouTube playlist module
│           ├── entities/
│           ├── playlist.controller.ts
│           ├── playlist.module.ts
│           └── playlist.service.ts
│
└── frontend/                   # React + Vite SPA (port 80 in Docker)
    ├── index.html
    ├── nginx.conf
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.cjs
    ├── postcss.config.cjs
    ├── docker/                 # Nginx Dockerfile
    ├── public/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── routes.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   └── TimerConfigPage.tsx
        ├── components/
        │   ├── home/
        │   ├── layout/
        │   ├── timer/
        │   ├── task/
        │   ├── config/
        │   ├── theme/
        │   └── youtube/
        ├── services/           # API clients (axios)
        │   ├── api.ts
        │   ├── taskService.ts
        │   ├── timerService.ts
        │   └── themeService.ts
        ├── contexts/
        ├── hooks/
        ├── interfaces/
        ├── types/
        ├── constants/
        ├── theme/
        └── styles/
```

## Modules

| Module      | Responsibility                                                   |
|-------------|------------------------------------------------------------------|
| `tasks`     | CRUD for user tasks linked to Pomodoro sessions                  |
| `timer`     | Timer lifecycle + per-user timer presets (work / break lengths)  |
| `sessions`  | Persists completed Pomodoro sessions for history / stats         |
| `playlist`  | YouTube playlist references played alongside the timer           |
| `seeder`    | Seeds initial data (default timer configs, demo tasks)           |
| `config`    | Centralized TypeORM / environment configuration                  |

## Getting Started

### Run with Docker (recommended)

```bash
docker compose up --build
```

- Frontend → http://localhost
- Backend  → http://localhost:3001
- MySQL    → localhost:3306 (db: `pomodoro_timer`, user: `root` / `root`)

The backend expects a `backend/.env` file (loaded by `env_file` in `docker-compose.yml`).

### Run locally (without Docker)

Backend:
```bash
cd backend
npm install
npm run dev        # nest start --watch
```

Frontend:
```bash
cd frontend
npm install
npm run dev        # vite
```

### Build for production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Database

MySQL schema is bootstrapped via the SQL files in `backend/sql/`:
- `create_tasks_table.sql`
- `create_timer_configs_table.sql`

TypeORM entities live next to each module under `src/<module>/entities/`.
