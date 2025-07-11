
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce una dirección de correo válida.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const testUsers = {
  'admin@ankae.com': { role: 'admin', name: 'Usuario Administrador' },
  'ab1422@ankae.com': { role: 'technician', name: 'Usuario Técnico' },
};

export default function LoginPage() {
  const { userProfile, loading, setPreviewUser } = useAuth();
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
    if (userProfile) {
      router.push('/dashboard');
    }
  }, [userProfile, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
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
        title: 'Inicio de Sesión Exitoso',
        description: "¡Bienvenido de nuevo! Estás siendo redirigido...",
      });
      router.push('/dashboard');
    } else {
       toast({
        variant: 'destructive',
        title: 'Fallo en el Inicio de Sesión',
        description: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
      });
    }

    setIsSubmitting(false);
  };

  if (loading || userProfile) {
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
          <CardTitle className="text-2xl text-center">Bienvenido a EquipTrace</CardTitle>
          <CardDescription className="text-center">Introduce tus credenciales para acceder a tu cuenta</CardDescription>
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
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
