import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Mock Data
const mockDeliveries = [
    { id: 'del_1', tech: 'John Doe', items: 2, date: '2024-05-20', status: 'Completado' },
    { id: 'del_2', tech: 'Jane Smith', items: 1, date: '2024-05-19', status: 'Completado' },
    { id: 'del_3', tech: 'John Doe', items: 5, date: '2024-05-18', status: 'Completado' },
]

export default function DeliveriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Entregas</CardTitle>
        <CardDescription>
          Consulta un registro de todas las entregas de equipos anteriores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead>Ítems</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.tech}</TableCell>
                <TableCell>{delivery.items}</TableCell>
                <TableCell>{delivery.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">{delivery.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="icon" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
