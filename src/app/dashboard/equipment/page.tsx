import Link from 'next/link';
import { PlusCircle, File } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data
const mockEquipment = [
  { id: '1', type: 'Laptop', model: 'MacBook Pro 16"', serialNumber: 'C02Z1234ABCD', status: 'available' },
  { id: '2', type: 'Monitor', model: 'Dell U2721DE', serialNumber: 'SN-DELL-5678', status: 'assigned' },
  { id: '3', type: 'Server', model: 'HPE ProLiant DL380', serialNumber: 'HP-XYZ-9101', status: 'maintenance' },
  { id: '4', type: 'Laptop', model: 'Lenovo ThinkPad X1', serialNumber: 'LEN-X1-CARBON-12', status: 'available' },
];

export default function EquipmentPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Equipment</CardTitle>
          <CardDescription>Manage your inventory and view their status.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Link href="/dashboard/equipment/new">
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Equipment
                </span>
              </Button>
            </Link>
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status === 'available' ? 'default' 
                    : item.status === 'assigned' ? 'secondary' 
                    : 'destructive'
                  } className={item.status === 'available' ? 'bg-green-600' : ''}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
