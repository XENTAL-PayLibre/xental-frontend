import { redirect } from 'next/navigation';

// /get-started is the marketing CTA alias — redirects to the actual sign-up page.
export default function GetStartedPage() {
  redirect('/signup');
}
