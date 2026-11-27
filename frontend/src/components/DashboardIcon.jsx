export default function DashboardIcon({ name, size = 23 }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v11H3Z" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 2v6m10-6v6M3 11h18m-13 4h1m6 0h1m-8 3h1m6 0h1" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    wallet: (
      <>
        <path d="M21 8H4V5l14-3v6M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h17V8Zm12 5h5v5h-5Z" />
      </>
    ),
    gift: (
      <>
        <path d="M3 10h18v4H3Zm2 4v8h14v-8M12 7v15" />
        <path d="M12 10C1 10 7-3 12 7c5-10 11 3 0 3Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M3 22a9 9 0 0 1 18 0Z" />
      </>
    ),
    support: (
      <>
        <path d="M3 13v-2a9 9 0 0 1 18 0v2M3 12h4v8H3Zm14 0h4v8h-4Zm4 7c0 4-5 4-9 4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 3H3v18h7m5-16 7 7-7 7m7-7H8" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 7 7" />
      </>
    ),
    bell: (
      <>
        <path d="M5 17h14l-2-4V8A5 5 0 0 0 7 8v5Zm5 4h4" />
      </>
    ),
    wash: (
      <>
        <rect x="3" y="2" width="18" height="20" rx="3" />
        <circle cx="12" cy="14" r="5" />
        <path d="M3 7h18m-14-3h1m4 0h1m-5 10c3 4 5-4 8 0" />
      </>
    ),
    hanger: <path d="M10 6a2 2 0 1 1 3 2l-1 1v2L2 18v2h20v-2l-10-7" />,
    iron: (
      <>
        <path d="M3 19h18l-2-10H9L3 19Zm6-10V5h9v4M2 22h20" />
      </>
    ),
    truck: (
      <>
        <path d="M2 5h13v12H2Zm13 5h4l3 4v3h-7" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    heart: <path d="M12 21 3 12C-3 5 7-2 12 6c5-8 15-1 9 6Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.home}
    </svg>
  );
}
