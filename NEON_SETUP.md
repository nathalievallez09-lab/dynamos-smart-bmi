# Neon Setup (Thesis Demo)

## 1. Add environment variable

In Vercel project settings, add:

- `DATABASE_URL` = your Neon pooled connection string

For local testing, create `.env` with the same `DATABASE_URL`.

## 2. Create schema + seed 6 users

Run:

```bash
npm install
npm run db:seed
```

This applies:

- `db/schema.sql`
- `db/seed.sql`

Seed includes:

- Admin login: `admin / admin123`
- 6 users: IDs `12345` to `12350`
- BMI history records for each user

## 3. Available API routes

- `POST /api/admin/login`
- `GET /api/admin/overview`
- `GET /api/admin/users`
- `GET /api/users/:userId`
- `GET /api/users/:userId/bmi-history`
- `PUT /api/users/:userId`

## 4. Frontend pages connected

- `/admin/login` uses real admin login API
- `/admin/dashboard` overview + user management pull Neon data
- `/dashboard/:userId` user profile + BMI history pull Neon data

If Neon is not reachable, UI falls back to mock data so your demo still runs.
