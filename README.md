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

## Required Environment Variables

Names only — never commit actual secret values.

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_IMGBB_API_KEY`

## Links

- Live Website: _to be added after deployment_
- Client Repository: this repository
- Server Repository: _to be added_
