# BB LaundryLink frontend

## Development

```sh
npm install
npm run dev
```

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

The homepage Login link opens `/login`, styled from the supplied reference. The form submits `{ email, password }` with `useLoginMutation`, handles loading and errors, stores the successful `{ token, user }` response in Redux, and returns to the homepage. The header shows the user's name and Logout. Subsequent API requests receive a Bearer token; logout clears credentials and the API cache.

Tokens remain in memory only: refresh requires login again. **Remember email** saves only the email address, never the password or token. The backend currently accepts email (not mobile), so the form uses an email field. Google, OTP, partner sign-in, and password reset are not implemented by the backend; those controls show explicit availability notices rather than pretending to authenticate. Customer registration is available at `/register` using `useRegisterMutation` and `POST /api/register`. Laundry cards remain sample data because there is no partner endpoint yet.

For a live login test, configure MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) and `JWT_SECRET` for the Go backend, apply its migration and create/seed an account with a bcrypt password. Start the backend on port 6060, then submit that account's email/password at `/login`. The backend's declared Go toolchain and dependencies must be installed. API tests use mocked HTTP responses, not a live database.

By default the API base URL is `/api/`. To use a different deployment, set `VITE_API_BASE_URL` to a base URL ending in `/` before building. Cross-origin deployments need backend CORS configured. Never put secrets in Vite variables.

Production hosting must serve the app's `index.html` for client-side routes (SPA fallback), and proxy `/api` to the backend unless a custom API base URL is set.

## Customer dashboard

- `/dashboard`: customer dashboard; requires an authenticated Redux user. Successful login now redirects here.
- `/dashboard/preview`: public design preview using the name Guest; it grants no account access.
- Search partner names/neighborhoods, filter services, toggle session-only favorites, and navigate sidebar panels.
- Profile uses the signed-in user's actual name/email. Logout clears Redux credentials and RTK Query cache.
- Listings, tracking, and offers are explicitly sample content. Wallet balance is unavailable, not a fabricated real balance. No booking, payment, wallet, notification, or order-tracking endpoints exist yet.
- The dashboard is responsive: mobile uses a dismissible navigation drawer and stacked widgets.

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
