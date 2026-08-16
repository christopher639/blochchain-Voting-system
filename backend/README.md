Backend server for the project.

Quick start

1. Install dependencies

```bash
cd backend
npm install
```

2. Run in development (uses nodemon)

```bash
npm run dev
```

3. Health check

Open http://localhost:4000/health

Notes
- This project expects environment variables in `.env` (already provided locally).
- Database connection uses `mongoose` and will read `MONGODB_URI` and `databaseName`.
