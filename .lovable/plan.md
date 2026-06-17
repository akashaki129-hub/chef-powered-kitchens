# Enrollment + Admin Dashboard

## 1. Enable Lovable Cloud
Provisions the backend (Postgres, auth, storage). No external accounts needed.

## 2. Database schema

**`chef_enrollments`** (public submissions)
- `id` uuid PK, `created_at` timestamptz
- `name` text, `phone` text, `email` text
- `role` enum: `chef | homemaker | culinary_student | professional_chef | freelancer`

**`customer_enrollments`** (public submissions)
- `id` uuid PK, `created_at` timestamptz
- `name` text, `phone` text, `email` text
- `preferred_service` text (Lunchbox / Daily Meals / Subscription / Other)

**`user_roles`** + `app_role` enum (`admin`, `user`) + `has_role()` security-definer fn — standard pattern so admins can read enrollments without privilege-escalation risk.

**RLS / GRANTs**
- Enrollment tables: `INSERT` allowed to `anon` + `authenticated` (so public forms work). `SELECT` only to `authenticated` admins via `has_role(auth.uid(),'admin')`. No `UPDATE`/`DELETE` from clients.
- `user_roles`: `SELECT` to `authenticated`, managed via SQL/admin only.

## 3. Public enrollment UI
- **`/join-as-chef`** route — form with name, phone, email, role dropdown → inserts into `chef_enrollments`. Zod validation, success toast.
- **`/enroll`** (customer) route — name, phone, email, preferred service dropdown → inserts into `customer_enrollments`.
- Add two CTA buttons on the landing page ("Become a Chef Partner", "Join as Customer") linking to these routes.

## 4. Admin area
- **`/auth`** — email/password sign-in (no public signup link; admins are seeded by promoting a user_id in SQL after they sign up once).
- **`/_authenticated/admin`** — gated by `has_role(uid,'admin')` via a server function; non-admins see "Not authorized".
- Tabs: **Chefs** and **Customers** — sortable tables (newest first) showing all columns, with CSV export and a search box.

## 5. Tech notes
- Reads/writes go through `createServerFn`:
  - `submitChefEnrollment`, `submitCustomerEnrollment` (public, no auth middleware, validate with Zod).
  - `listChefEnrollments`, `listCustomerEnrollments` (use `requireSupabaseAuth` + `has_role` check, return 403 otherwise).
- Admin route loader uses TanStack Query (`ensureQueryData` + `useSuspenseQuery`).
- Forms use react-hook-form + zod, existing shadcn `Form`, `Input`, `Select`, `Button`.

## 6. Seeding the first admin
After Cloud is enabled, you sign up at `/auth` once, then I'll insert your `user_id` into `user_roles` with role `admin` via a migration so you can access `/admin`.
