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
    { id: 'del_1', tech: 'John Doe', items: 2, date: '2024-05-20', status: 'Completed' },
    { id: 'del_2', tech: 'Jane Smith', items: 1, date: '2024-05-19', status: 'Completed' },
    { id: 'del_3', tech: 'John Doe', items: 5, date: '2024-05-18', status: 'Completed' },
]

export default function DeliveriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery History</CardTitle>
        <CardDescription>
          View a log of all past equipment deliveries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
