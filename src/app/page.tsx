
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const testUsers = {
  'admin@ankae.com': { role: 'admin', name: 'Admin User' },
  'ab1422@ankae.com': { role: 'technician', name: 'Technician User' },
};

export default function LoginPage() {
  const { user, loading, setPreviewUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    // Check for test users
    const isTestUser = data.email in testUsers;
    const isTestPassword = data.password === 'pass123';

    if (isTestUser && isTestPassword) {
      const testUserData = testUsers[data.email as keyof typeof testUsers];
      setPreviewUser({
        uid: `preview-${data.email}`,
        email: data.email,
        name: testUserData.name,
        role: testUserData.role as 'admin' | 'technician',
      });
      toast({
        title: 'Login Successful',
        description: "Welcome back! You're being redirected...",
      });
      router.push('/dashboard');
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Login Successful',
        description: "Welcome back! You're being redirected...",
      });
      // The useEffect hook will handle redirection
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Icons.truck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Welcome to EquipTrace</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@ankae.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <Card className="w-full max-w-sm mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Test Credentials</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p><span className="font-semibold">Admin:</span> admin@ankae.com</p>
          <p><span className="font-semibold">Technician:</span> ab1422@ankae.com</p>
          <p><span className="font-semibold">Password:</span> pass123</p>
        </CardContent>
      </Card>
    </main>
  );
}
