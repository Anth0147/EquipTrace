
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Home,
  Package,
  PackagePlus,
  PanelLeft,
  Settings,
  Truck,
  Users,
  History,
  LogOut,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { EquipmentProvider } from '@/context/EquipmentContext';

const NavLink = ({ href, icon: Icon, children, isCollapsed }: { href: string; icon: React.ElementType; children: React.ReactNode; isCollapsed: boolean }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Icon className="h-5 w-5" />
          {!isCollapsed && <span className="truncate">{children}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{children}</TooltipContent>}
    </Tooltip>
  </TooltipProvider>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userProfile, loading, logoutPreviewUser } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push('/');
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const handleLogout = async () => {
    logoutPreviewUser();
    router.push('/');
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <EquipmentProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className={`fixed inset-y-0 left-0 z-10 flex-col border-r bg-background transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-60'}`}>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Truck className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">EquipTrace</span>
            </Link>
            <NavLink href="/dashboard" icon={Home} isCollapsed={isCollapsed}>Panel</NavLink>
            {isAdmin && (
              <>
                <NavLink href="/dashboard/equipment" icon={Package} isCollapsed={isCollapsed}>Equipos</NavLink>
                <NavLink href="/dashboard/equipment/new" icon={PackagePlus} isCollapsed={isCollapsed}>Añadir Equipo</NavLink>
              </>
            )}
            <NavLink href="/dashboard/deliveries" icon={History} isCollapsed={isCollapsed}>Entregas</NavLink>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleLogout} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                     {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
                  </button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Cerrar Sesión</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>

        <div className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ${isCollapsed ? 'sm:pl-14' : 'sm:pl-60'}`}>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
             <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Alternar Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                   <Link
                      href="#"
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Truck className="h-5 w-5 transition-all group-hover:scale-110" />
                      <span className="sr-only">EquipTrace</span>
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Home className="h-5 w-5" />Panel</Link>
                    {isAdmin && (
                      <>
                      <Link href="/dashboard/equipment" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Package className="h-5 w-5" />Equipos</Link>
                      <Link href="/dashboard/equipment/new" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><PackagePlus className="h-5 w-5" />Añadir Equipo</Link>
                      </>
                    )}
                    <Link href="/dashboard/deliveries" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><History className="h-5 w-5" />Entregas</Link>
                     <button onClick={handleLogout} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </button>
                </nav>
              </SheetContent>
            </Sheet>
            <Button size="icon" variant="outline" className="hidden sm:inline-flex" onClick={() => setIsCollapsed(!isCollapsed)}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Alternar Menú</span>
            </Button>

            <div className="relative ml-auto flex-1 md:grow-0">
              {/* Search bar can go here */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Users />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userProfile?.name || userProfile?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Configuración</DropdownMenuItem>
                <DropdownMenuItem disabled>Soporte</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </EquipmentProvider>
  );
}
