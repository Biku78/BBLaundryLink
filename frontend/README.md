# BB LaundryLink frontend

## Development

```sh
npm install
npm run dev
```

## Bootstrap styling

Bootstrap 5 is installed locally through npm. `src/styles/bootstrap.scss` imports the grid, containers, forms, buttons, alerts, badges, spinners, and utility classes; it is loaded before custom styles in `main.jsx`.

Use Bootstrap classes first for new UI: `row`, `col`, `row-cols-*`, `g-*`, `d-flex`, `align-items-center`, `justify-content-between`, `btn`, `form-control`, `form-select`, `form-check-input`, and `alert`. The homepage and dashboard partner lists use Bootstrap's responsive grid. Repeated flex-layout CSS declarations have been removed where utilities now handle them.

Keep custom CSS for the brand gradients, artwork, specialized hero/floating-dock layout, and viewport-height fitting. Bootstrap Reboot and JS plugins are intentionally not imported: React manages menus/dialogs, and the existing typography and dialog behavior are preserved. Theme colors and the compact button line height are configured in the Sass entry point. Sass is compiled by Vite; no CDN is required.

## Structure

- `src/main.jsx`: Redux `Provider` → `BrowserRouter` → `App` (inside StrictMode).
- `src/App.jsx`: application routes (`/` homepage, `*` not-found page).
- `src/pages/HomePage.jsx`: marketplace homepage.
- `src/app/store.js`: Redux Toolkit store and RTK Query middleware/listeners.
- `src/features/filters/filtersSlice.js`: shared search and service filter state.
- `src/services/api.js`: RTK Query API and generated hooks.

## API usage

The existing Go server exposes `GET /api/health` and `POST /api/login` on port 6060. Vite proxies relative `/api` requests to it, so the browser never needs to call localhost directly. Run the Go backend with its database/environment configured to use these endpoints.

```jsx
import { useGetHealthQuery, useLoginMutation } from './services/api'

// Inside a component:
const { data, isLoading, error } = useGetHealthQuery()
const [login, { isLoading: isLoggingIn }] = useLoginMutation()
// In an async submit handler (handle errors with try/catch):
// const response = await login({ email, password }).unwrap()
```

The homepage Login link opens `/login`, styled from the supplied reference. The form submits `{ email, password }` with `useLoginMutation`, handles loading and errors, stores the successful `{ token, user }` response in Redux, and redirects to `/dashboard`. The dashboard profile shows the user's details and Logout. Subsequent API requests receive a Bearer token; logout clears credentials and the API cache.

Tokens remain in memory only: refresh requires login again. **Remember email** saves only the email address, never the password or token. The backend currently accepts email (not mobile), so the form uses an email field. Google, OTP, partner sign-in, and password reset are not implemented by the backend; those controls show explicit availability notices rather than pretending to authenticate. Customer registration is available at `/register` using `useRegisterMutation` and `POST /api/register`. Laundry cards remain sample data because there is no partner endpoint yet.

For a live login test, configure MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) and `JWT_SECRET` for the Go backend, apply its migration and create/seed an account with a bcrypt password. Start the backend on port 6060, then submit that account's email/password at `/login`. The backend's declared Go toolchain and dependencies must be installed. API tests use mocked HTTP responses, not a live database.

By default the API base URL is `/api/`. To use a different deployment, set `VITE_API_BASE_URL` to a base URL ending in `/` before building. Cross-origin deployments need backend CORS configured. Never put secrets in Vite variables.

Production hosting must serve the app's `index.html` for client-side routes (SPA fallback), and proxy `/api` to the backend unless a custom API base URL is set.

## Marketplace homepage

The redesigned `/` page uses a floating header, photographic service cards, an interactive price estimator, six sample partner cards, side-by-side comparison, a guide, illustrative stories, and native expandable FAQs.

- Search and service filters use Redux; nearest/price/rating sorting is client-side.
- Select 2–3 partners to open the comparison table. Favorites and comparison selections are page-session state, not saved account data.
- `src/data/samplePartners.js` is the shared source for partner details, `image` URLs, and service-specific sample `rates` used by both homepage and dashboard. Change these fields to update images and prices; there is no partner/image API yet.
- Images are separate WebP assets (not whole-page screenshot backgrounds). Service images respond to hover/focus and select the corresponding calculator service; the estimator's provider thumbnail changes with the selected service.
- `estimateLaundry` selects the lowest sample rate and computes quantity × rate, plus the optional rounded 30% express surcharge. Wash/fold and dry cleaning use kg; ironing uses pieces; shoe care uses pairs. Pickup is included only in the illustrative estimate.
- No calculator or booking button creates an order or payment. Stories, ratings, distances, turnaround times, and promotions are explicitly samples rather than verified real activity.
- The homepage modal supports Escape, focus trapping, and restoring focus to its trigger. Navigation, FAQs, comparison, and service cards support keyboard use.

## Customer dashboard

- `/dashboard`: customer dashboard; requires an authenticated Redux user. Successful login now redirects here.
- `/dashboard/preview`: public design preview using the name Guest; it grants no account access.
- The redesigned dashboard has no sidebar: a rounded sticky top bar and floating Home/Bookings/Track/Wallet/Profile dock provide navigation.
- Search partner names/neighborhoods/services, filter services, sort by price/rating, switch grid/list view, and toggle session-only favorites.
- Six sample partner cards, a welcome/search hero, laundry photo, sample tracking, wallet placeholder, service steps, and offer cards follow the supplied bento-style reference.
- Offer code buttons copy sample codes when browser clipboard access is available; sample codes are not redeemable.
- Profile uses the signed-in user's actual name/email. Logout clears Redux credentials and RTK Query cache.
- Listings, tracking, and offers are explicitly sample content. Wallet balance is unavailable, not a fabricated real balance. No booking, payment, wallet, notification, or order-tracking endpoints exist yet.
- Bootstrap responsive rows/columns and utilities handle card layouts. The bottom dock stays visible on phones, with safe-area spacing and content padding below the final section. Dashboard typography uses locally bundled Outfit fonts (no font CDN).

## Customer registration

Apply **both** SQL up migrations in `backend/database/migrations` in order. Existing databases specifically need `000002_add_mobile_to_users.up.sql`; otherwise registration cannot insert the mobile number. The new column is nullable so existing seeded accounts are unaffected.

`POST /api/register` accepts `name`, `mobile` (10 digits), `email`, `password`, `confirm_password`, and `accept_terms` (boolean). It creates a customer with a bcrypt password hash and returns HTTP 201. Invalid input returns 400, duplicate email returns 409, and database errors return a generic 500 without exposing internals. Public registration cannot choose an admin or partner role. The frontend redirects to login after success; it does not automatically sign in.

The frontend and backend validate matching passwords (minimum 8 characters, maximum 72 UTF-8 bytes). Email uniqueness is enforced by the existing database unique key. Mobile numbers are stored but are not verified or used to sign in.

Before public deployment, review the in-app development terms/privacy notices, configure TLS and API rate limiting, and configure a monitored support address. Google/OTP and shop onboarding are not implemented.

Backend validation tests: `cd backend && go test ./internal/services`. This requires the Go version declared in `go.mod` and its dependencies. Frontend HTTP tests mock the backend; live MySQL registration/login must be verified in your configured backend environment.

## Checks

```sh
npm run build
npm run lint
npm test
```
