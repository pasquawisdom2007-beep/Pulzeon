# Pulzeon — Digital Product Store

A full-stack digital product store with a blue/cyan neon cyberpunk aesthetic.
Sell one-time digital products and a recurring **Pulzeon Premium** subscription,
with manual (Opay bank transfer) payment confirmation via an admin panel.

**Powered by PASQUA TECH.**

---

## Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | Next.js 14 (App Router) — single deployable app        |
| Styling      | Tailwind CSS + Framer Motion (neon theme + animations) |
| Database     | MongoDB Atlas via Mongoose                             |
| Auth         | NextAuth.js (Credentials provider, JWT) + bcrypt       |
| File storage | Cloudinary (payment proofs, product files/images)      |
| Deploy       | Vercel **or** Render (both configs included)           |

Because everything lives in one Next.js app (UI + API routes), you can deploy
to **either** Vercel or Render — no separate backend service required.

---

## Features

- 15+ pages: Home, Shop, Product detail, Pricing, Cart, Checkout, Login,
  Register, Dashboard, Premium (gated), Admin, Blog, FAQ, Contact, Terms.
- Login-gated purchases — users must register/log in before buying.
- Role-based access (`user` / `admin`) with route middleware protection.
- Manual payment flow: Opay transfer details + payment-proof upload → order
  created as `pending` → admin confirms → product/subscription unlocked.
- Payment logic is abstracted so **Paystack/Flutterwave can be swapped in later**
  without rewriting order logic.
- Auto-update system: add updates in `/admin`, they appear instantly on the
  Home ticker, Dashboard and `/blog` — no redeploy needed.
- Neon design system: glowing cards/buttons, animated background blobs, and
  floating WhatsApp + Telegram action buttons on every page.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → fill in MONGODB_URI, NEXTAUTH_SECRET, Cloudinary keys

# 3. Seed the database (admin account + sample products + updates)
npm run seed

# 4. Run the dev server
npm run dev
# open http://localhost:3000
```

### Default admin login (from the seed script)

```
Email:    admin@pulzeon.com
Password: PulzeonAdmin123!
```

Change these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding.

---

## Environment Variables

See [`.env.example`](./.env.example) for the full list:

| Variable                | Required | Description                               |
| ----------------------- | -------- | ----------------------------------------- |
| `MONGODB_URI`           | Yes      | MongoDB Atlas connection string           |
| `NEXTAUTH_SECRET`       | Yes      | `openssl rand -base64 32`                 |
| `NEXTAUTH_URL`          | Yes      | Full public URL of the deployment         |
| `CLOUDINARY_CLOUD_NAME` | Yes\*    | Cloudinary cloud name                     |
| `CLOUDINARY_API_KEY`    | Yes\*    | Cloudinary API key                        |
| `CLOUDINARY_API_SECRET` | Yes\*    | Cloudinary API secret                     |
| `ADMIN_EMAIL`           | Seed     | Admin email created by `npm run seed`     |
| `ADMIN_PASSWORD`        | Seed     | Admin password created by `npm run seed`  |

\*Cloudinary is required for uploading payment proofs and product files.

---

## Setup: MongoDB Atlas (free)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a user with a password.
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere) so Vercel/Render
   can connect.
4. **Connect → Drivers** → copy the connection string into `MONGODB_URI`
   (replace `<password>` and add `/pulzeon` as the DB name).

## Setup: Cloudinary (free)

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. From the dashboard copy **Cloud name**, **API Key**, **API Secret** into the
   matching env vars.

---

## Deploy to Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the environment variables (from `.env.example`) in
   **Project → Settings → Environment Variables**.
   - Set `NEXTAUTH_URL` to your Vercel URL, e.g. `https://pulzeon.vercel.app`.
4. Deploy. Vercel auto-detects Next.js (`vercel.json` is included).
5. Seed production data by running `npm run seed` locally **with your production
   `MONGODB_URI`** in `.env` (it writes to the same Atlas database).

---

## Deploy to Render

A [`render.yaml`](./render.yaml) blueprint is included.

1. Push this repo to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) →
   **New → Blueprint** → select this repo. Render reads `render.yaml`.
3. Fill in the environment variables when prompted (`MONGODB_URI`,
   `NEXTAUTH_SECRET`, Cloudinary keys).
4. After the first deploy, copy the Render URL (e.g. `https://pulzeon.onrender.com`)
   and set it as `NEXTAUTH_URL`, then trigger a redeploy.
5. Seed production data with `npm run seed` locally using the production
   `MONGODB_URI`.

> Render's free web service binds to the `PORT` env var automatically — the
> `start` script (`next start -p ${PORT:-3000}`) already handles this.

---

## Project Structure

```
app/                     # App Router pages + API routes
  api/                   # register, orders, upload, download, auth, admin/*
  admin/                 # admin panel (role-protected)
  dashboard/             # user dashboard + premium gated area
  shop/                  # shop grid + product detail
  ...                    # pricing, cart, checkout, blog, faq, contact, terms
components/              # UI components (navbar, footer, cards, forms, admin)
lib/                     # mongodb, auth, cloudinary, data access, catalog, site
models/                  # Mongoose models: User, Product, Order, Update
scripts/seed.ts          # seed admin + products + updates
middleware.ts            # protects /dashboard, /checkout, /admin
```

---

## Payment Flow (manual, gateway-ready)

1. Customer checks out → sees Opay transfer details:
   - **Account Number:** 9127857212
   - **Bank:** Opay
   - **Account Name:** Onuoha Paschal Chiagozie
2. Customer clicks **"I've made payment"**, uploads a proof screenshot
   (Cloudinary) and enters the transaction reference.
3. An `Order` is created with status **`pending`**.
4. Admin opens `/admin`, reviews the proof and clicks **Confirm Payment**.
5. Status becomes **`paid`** and the product/subscription is unlocked for the user.

**Swapping in a gateway later:** order creation and unlocking are isolated in the
order API + `lib/data.ts`. A Paystack/Flutterwave webhook only needs to flip an
order to `paid` and call the same unlock logic — no UI or schema rewrite required.

---

## Links

- WhatsApp channel: https://whatsapp.com/channel/0029VbCJho147XeEEuR1LA3s
- Telegram channel: https://t.me/pasquamdsukuna

---

Powered by **PASQUA TECH**.
