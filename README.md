# SalonBook — Client

Salon Appointment Booking Platform — web client.

Customers can explore salon services, view service details, and request
appointments online. The admin manages services, reviews appointment
requests, confirms or cancels appointments, and monitors payments.
Customers pay for confirmed appointments through Stripe.

## Important Features

- Browse, search, filter and sort salon services
- Protected service details and appointment booking
- Role-based dashboards (Customer / Admin)
- Appointment confirm / cancel flows
- Stripe Checkout payment for confirmed appointments
- Profile management with image upload (ImgBB)

## Technology Stack

- Next.js + TypeScript
- Tailwind CSS
- Better Auth (email/password + Google)
- Stripe Checkout
- ImgBB (image hosting)

## Installation

```bash
npm install
cp .env.example .env.local
# fill in the values in .env.local (never commit it)
```

## Run Locally

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # run production build
```

The server (salonbook-server) must be running for API data.

## Pages & Routes

- `/` — Home: banner, featured services, categories, how it works
- `/services` — Browse services with search, category filter, price sort
- `/services/[id]` — Service details + booking form (login required)
- `/sign-up`, `/sign-in` — email/password + Google; password needs 6+
  characters with uppercase and lowercase
- `/dashboard/customer` — overview, my appointments (cancel / pay), profile
- `/dashboard/admin` — overview, manage services, add/edit service,
  manage appointments, manage users (block/unblock), transactions, profile
- `/payment/success`, `/payment/cancel` — Stripe return pages

Admin accounts are never created from public registration; an existing
account is promoted from the server with `npm run make-admin`.

## Required Environment Variables

Names only — never commit actual secret values.

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_IMGBB_API_KEY`

## Links

- Live Website: https://salonbook-client-sigma.vercel.app
- Live API: https://salonbook-server-nu.vercel.app
- Client Repository: this repository
- Server Repository: _to be added_
