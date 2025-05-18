
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const emailSchema = z.string().email({ message: 'Invalid email address' });
const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' });

const SignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const SignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = SignUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Email confirmation can be enabled in Supabase project settings
      // emailRedirectTo: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002').origin}/auth/callback`,
    },
  });

  if (error) {
    return {
      message: error.message || 'Could not authenticate user.',
    };
  }

  // Revalidate path or redirect if email confirmation is not required
  // For now, we assume email confirmation might be on, so Supabase handles the next step.
  // If email confirmation is off, or you want to redirect immediately:
  // revalidatePath('/', 'layout');
  // redirect('/');
  return {
    message: 'Check your email for a confirmation link.', // Adjust if email confirmation is off
  };
}

export async function signInWithEmail(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
     return {
      message: error.message || 'Could not authenticate user.',
    };
  }

  revalidatePath('/', 'layout'); // Revalidate all paths to update UI based on session
  redirect('/'); // Redirect to home page after successful login
}

export async function signOutUser() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
