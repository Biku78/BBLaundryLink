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

## Supplied homepage and dashboard designs

The uploaded source designs are integrated directly, rather than approximated from screenshots:

- `src/designs/MarketplaceDesign.tsx`: supplied `App-2.tsx`, used for `/`.
- `src/designs/CustomerDesign.tsx`: supplied `App.tsx`, used for `/dashboard` and public `/dashboard/preview`.
- The existing `/images/logo.webp` is unchanged and used in both headers.
- Login and Register buttons open the real auth routes. Protected dashboard access, Redux/RTK Query authentication, account name/email (including backend capitalized fields), and actual logout are retained.
- External photo URLs have been replaced with bundled WebP assets; neutral illustrative avatars avoid broken remote profile photos.
- Motion, expanding service imagery, comparison, FAQs, favorites, categories, dock tabs, and the supplied app-promo layout are retained. Dialogs support Escape, focus trapping/restoration, and scroll locking.
- Partner/booking/review/tracking/wallet content is explicitly a design sample. Preview booking and wallet controls do not create real orders or payments. Clipboard copying works when browser permissions allow it.
- The calculator uses shared sample service rates with kg/piece/pair units and optional 30% express surcharge. Booking previews also use service-specific rates.

### Style isolation

Bootstrap remains in place for auth and other existing pages. The supplied designs use Tailwind, Framer Motion, and Lucide as in the original project. `npm run design:css` compiles `src/designs/design-source.css` and scopes all selectors under `.provided-design`, preventing Tailwind resets and utilities from altering login/register. It runs automatically before production builds. Run it again after changing Tailwind classes during development. `integration.css` contains only integration, preserved-logo, accessibility, and responsive overrides. Fonts are bundled locally through Fontsource.

## Unified customer access

`src/pages/AccountPage.jsx` provides one shared Login/Create account component. `/login` and `/register` render the same component with route-selected form modes; successful registration switches to Login and prefills the new email. Existing links and deep links remain supported. The logo and home/dashboard designs are unchanged.

The scoped `AccountPage.css` introduces a forest-green/cream layout with CSS laundry artwork, responsive Bootstrap form grids, show/hide password controls, accessible policy dialogs, and compact desktop sizing without clipping. Mobile permits natural vertical scrolling. Backend endpoints, Redux/RTK Query flow, registration validation, and in-memory authentication are unchanged. Google/OTP placeholder buttons are omitted rather than presenting unavailable sign-in methods. Password-reset help points to support; no reset API is invented.

Registration still requires the existing database migration, a running Go backend and MySQL. Live authentication cannot be exercised in this sandbox without that backend; browser flow checks use explicitly mocked API responses.

## Checks

```sh
npm run build
npm run lint
npm test
```
