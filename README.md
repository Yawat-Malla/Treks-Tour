# Annapurna Trails

Guest-booking site for a Pokhara-based Annapurna trekking company. Visitors never create an account. Staff edit the live title, logo, copy, treks and bookings through a secret URL and PIN.

## Run locally

Postgres and Redis must be available on `localhost:5432` and `localhost:6379`. Docker Compose is included if you use Docker:

```bash
docker compose up -d
```

If Docker is unavailable, create a database that matches `.env`:

```text
postgresql://annapurna:annapurna@localhost:5432/annapurna
```

Then:

```bash
cp .env.example .env
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Public site: http://localhost:3000
- API: http://localhost:4000
- Staff studio: http://localhost:3000/studio-7f3a
- PIN: `482916` (change `ADMIN_PIN` and `ADMIN_PATH` in `.env` and `apps/web/.env.local`)

Languages: English (default `/`), Chinese `/zh`, Korean `/ko`, Hebrew `/he` (RTL).

Booking emails log to the API console unless SMTP is set.
