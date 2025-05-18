
'use client';

import { useActionState, useFormStatus } from 'react'; // Changed import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertTriangle, LogIn, UserPlus } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  action: (prevState: any, formData: FormData) => Promise<{ message: string; errors?: any }>;
}

function SubmitButton({ mode }: { mode: 'login' | 'signup' }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {mode === 'login' ? <LogIn className="mr-2" /> : <UserPlus className="mr-2" />}
      {pending ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Log In' : 'Sign Up')}
    </Button>
  );
}

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, { message: '' }); // Renamed hook

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md shadow-xl">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' ? 'Log in to access your StudyTube lectures.' : 'Sign up to start organizing your studies.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {state?.errors?.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle size={14} /> {state.errors.email[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
               {state?.errors?.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                   <AlertTriangle size={14} /> {state.errors.password[0]}
                </p>
              )}
            </div>
            {state?.message && !state.errors && !state.message.toLowerCase().includes("confirmation") && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center gap-2">
                <AlertTriangle size={16} /> {state.message}
              </p>
            )}
             {state?.message && state.message.toLowerCase().includes("confirmation") && (
              <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                {state.message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton mode={mode} />
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href={mode === 'login' ? '/auth/signup' : '/auth/login'}>
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
