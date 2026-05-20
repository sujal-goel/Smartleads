# Smart Leads Dashboard

Smart Leads Dashboard is a full-stack lead management system for sales teams and administrators. It combines a React frontend, an Express and TypeScript backend, and MongoDB persistence to manage leads, users, authentication, and lead-export workflows.

## Project Overview

The application is designed to help teams track prospects through the sales pipeline. Users can sign in, manage leads, filter and export records, and administer user roles depending on their access level.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Containerization | Docker Compose |

## Folder Structure

```text
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/        # Environment configuration
│       ├── controllers/   # Route handlers
│       ├── libs/          # DB and JWT helpers
│       ├── middlewares/   # Auth, RBAC, validation, error handling
│       ├── models/        # Mongoose models
│       ├── routes/        # Express routes
│       ├── types/         # Shared TypeScript types
│       ├── utils/         # API helpers and async wrapper
│       └── validators/    # Zod schemas
├── frontend/
│   └── src/
│       ├── app/           # Feature pages and feature components
│       ├── components/    # Shared layout and UI components
│       ├── context/       # Auth and theme context
│       ├── hooks/         # Data and UI hooks
│       ├── lib/           # API client and utility functions
│       ├── router/        # Route protection
│       └── types/         # Frontend TypeScript types
└── docker-compose.yml
```

## How To Operate

### Prerequisites

- Node.js 20 or newer
- MongoDB running locally or through Docker
- npm

### Local Development

Start the backend first, then the frontend:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Default local URLs:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Docker Development

Run the full stack with Docker Compose:

```bash
docker-compose up --build
```

Default Docker ports:

- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Environment Variables

Create `backend/.env` with these values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

## Use Cases

- Sales teams can create and update leads while tracking the current sales stage.
- Managers can filter, search, sort, and export lead data for reporting.
- Administrators can manage user accounts and control role-based access.
- Teams can run the app locally for demos, development, or internal testing.
- The Docker setup makes it easy to launch the full stack without manual service setup.

## API Documentation

The API reference is maintained separately in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Notes

- The backend defaults to port `5000` and the frontend defaults to port `5173`.
- If your frontend origin changes, update `CORS_ORIGIN` in the backend environment.
