import NewEquipmentForm from '@/components/equipment/new-equipment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewEquipmentPage() {
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
          <NewEquipmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
