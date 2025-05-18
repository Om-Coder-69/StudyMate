
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOutUser } from '@/app/auth/actions';


export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <>
      <Header showBackButton />
      <main className="container mx-auto p-4 md:p-6 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary ring-offset-2 ring-offset-background">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
              <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                {user.email ? getInitials(user.email) : <UserCircle size={48}/>}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>Manage your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold text-foreground break-all">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm text-foreground break-all">{user.id}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
              <p className="text-sm text-foreground">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
              </p>
            </div>
            {/* Add more profile information or settings here */}
            <form action={signOutUser} className="pt-4">
                 <Button type="submit" variant="destructive" className="w-full">
                    Log Out
                </Button>
            </form>
          </CardContent>
        </Card>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} StudyTube. Keep learning!</p>
        <p>Created by Om Mittal</p>
      </footer>
    </>
  );
}
