
'use client';

import * as React from 'react';
import NewEquipmentForm from '@/components/equipment/new-equipment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Equipment } from '@/lib/types';
import { useEquipment } from '@/context/EquipmentContext';

export default function NewEquipmentPage() {
  const { recentlyAdded } = useEquipment();

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Equipo</CardTitle>
          <CardDescription>
            Rellena los detalles a continuación para añadir un nuevo artículo al inventario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewEquipmentForm />
        </CardContent>
      </Card>
      
      {recentlyAdded.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Añadidos Recientemente (Esta Sesión)</CardTitle>
                <CardDescription>Artículos que has añadido en esta sesión.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Número de Serie</TableHead>
                            <TableHead>Cantidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentlyAdded.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.type}</TableCell>
                                <TableCell>{item.serialNumber}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
