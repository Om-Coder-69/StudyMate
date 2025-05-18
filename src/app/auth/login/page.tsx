
import AuthForm from '@/components/auth/AuthForm';
import { signInWithEmail } from '@/app/auth/actions';
import Header from '@/components/layout/Header'; // Assuming you want a header

export default function LoginPage() {
  return (
    <>
      <Header /> 
      <main className="container mx-auto p-4">
        <AuthForm mode="login" action={signInWithEmail} />
      </main>
    </>
  );
}
