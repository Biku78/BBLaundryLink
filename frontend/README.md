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

Hooks are prepared for the existing endpoints; homepage login/register dialogs remain previews. No automatic login or health request runs on homepage load. Laundry cards remain sample data because the backend has no partner endpoint yet.

By default the API base URL is `/api/`. To use a different deployment, set `VITE_API_BASE_URL` to a base URL ending in `/` before building. Cross-origin deployments need backend CORS configured. Never put secrets in Vite variables.

Production hosting must serve the app's `index.html` for client-side routes (SPA fallback), and proxy `/api` to the backend unless a custom API base URL is set.

## Checks

```sh
npm run build
npm run lint
```
