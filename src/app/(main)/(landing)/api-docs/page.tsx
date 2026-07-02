import { redirect } from 'next/navigation';

// /api-docs is the navbar shortcut — redirects to the canonical docs URL.
export default function ApiDocsPage() {
  redirect('/docs/api-reference');
}
