
import AuthForm from '@/components/auth/AuthForm';
import { signUpWithEmail } from '@/app/auth/actions';
import Header from '@/components/layout/Header'; // Assuming you want a header

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <AuthForm mode="signup" action={signUpWithEmail} />
      </main>
    </>
  );
}
