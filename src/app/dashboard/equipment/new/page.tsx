
'use client';

import * as React from 'react';
import NewEquipmentForm from '@/components/equipment/new-equipment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Equipment } from '@/lib/types';

export default function NewEquipmentPage() {
  const [recentlyAdded, setRecentlyAdded] = React.useState<Equipment[]>([]);

  const handleEquipmentAdded = (newEquipment: Equipment) => {
    setRecentlyAdded((prev) => [newEquipment, ...prev]);
  };

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Register New Equipment</CardTitle>
          <CardDescription>
            Fill in the details below to add a new item to the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewEquipmentForm onEquipmentAdded={handleEquipmentAdded} />
        </CardContent>
      </Card>
      
      {recentlyAdded.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>Items added in this session.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Quantity</TableHead>
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
