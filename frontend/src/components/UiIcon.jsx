export default function UiIcon({ name, size = 22 }) {
  const paths = {
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
    shop: <><path d="M3 10v11h18V10M2 10l2-7h16l2 7c-2 3-4 3-5 0-2 3-4 3-5 0-2 3-4 3-5 0-2 3-4 3-5 0Z"/><path d="M9 21v-7h6v7"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></>,
    lock: <><rect x="4" y="10" width="16" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/></>,
    login: <><path d="M14 3h6v18h-6M3 12h12m-5-5 5 5-5 5"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="m3 3 18 18M9 5a12 12 0 0 1 13 7s-1 3-4 5M6 6c-2 2-4 6-4 6s4 7 10 7c2 0 3 0 4-1"/><path d="M10 10a3 3 0 0 0 4 4"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.user}</svg>
}
