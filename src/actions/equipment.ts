
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const AddEquipmentSchema = z.object({
  itemType: z.string().min(2),
  itemSerialNumber: z.string().min(5),
  quantity: z.coerce.number().min(1).default(1),
});

type AddEquipmentInput = z.infer<typeof AddEquipmentSchema>;

export async function addEquipment(input: AddEquipmentInput) {
  try {
    const validation = AddEquipmentSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: 'Invalid input.' };
    }

    const { itemType, itemSerialNumber, quantity } = validation.data;

    const equipmentCollection = collection(db, 'equipment');
    const newEquipmentDocRef = await addDoc(equipmentCollection, {
      type: itemType,
      serialNumber: itemSerialNumber,
      quantity: quantity,
      status: 'available',
      createdAt: serverTimestamp(),
    });
    
    revalidatePath('/dashboard/equipment');

    return {
      success: true,
      data: {
        id: newEquipmentDocRef.id,
        type: itemType,
        serialNumber: itemSerialNumber,
        quantity: quantity,
      },
    };
  } catch (error) {
    console.error('Failed to add equipment:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
