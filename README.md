# RS Estates Frontend

Next.js App Router frontend for the real-estate backend API.

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Backend API: Express/PostgreSQL real-estate service

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Default API URL:

```text
https://rs-real-estate-backend.onrender.com
```

Change `NEXT_PUBLIC_API_BASE_URL` in `.env.local` if you want to point the UI to a local backend.

## Implemented Screens

- `/` property search with filters, sorting and pagination
- `/properties/[id]` SEO-friendly property details with similar properties
- `/login` and `/register`
- `/dashboard` current user's listings
- `/dashboard/new` create listing with image upload
- `/dashboard/edit/[id]` edit own listing
- `/inquiries` sent and received inquiries
