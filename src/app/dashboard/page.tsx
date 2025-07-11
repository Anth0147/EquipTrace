'use client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Package, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Equipos Totales</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,254</div>
        <p className="text-xs text-muted-foreground">+20.1% del último mes</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+23</div>
        <p className="text-xs text-muted-foreground">+5.2% desde ayer</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Disponibles para Asignar</CardTitle>
        <CheckCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">893</div>
        <p className="text-xs text-muted-foreground">71% del stock total</p>
      </CardContent>
    </Card>
  </div>
);

const TechnicianDashboard = () => (
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Equipos Asignados</CardTitle>
        <CardDescription>
          Aquí están los artículos asignados a ti. Por favor, confirma la recepción.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
            <p>Actualmente no tienes equipos asignados.</p>
            <p className="text-sm mt-2">Vuelve a consultar más tarde para nuevas asignaciones.</p>
        </div>
      </CardContent>
    </Card>
    <div className="mt-4">
        <Link href="/dashboard/deliveries">
            <Button variant="outline">Ver Entregas Anteriores</Button>
        </Link>
    </div>
  </div>
);

export default function DashboardPage() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        ¡Bienvenido, {userProfile?.name || userProfile?.email}!
      </h1>
      {userProfile?.role === 'admin' ? <AdminDashboard /> : <TechnicianDashboard />}
    </div>
  );
}
