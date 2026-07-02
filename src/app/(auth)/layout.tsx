import React from 'react';

// Auth layout — no Navbar or Footer.
// Add any shared auth chrome here (e.g. logo-only header) when needed.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // AuthShell owns its own full-screen layout — no wrapper needed here.
  return <>{children}</>;
}
