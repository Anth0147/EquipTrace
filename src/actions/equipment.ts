
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const AddEquipmentSchema = z.object({
  itemType: z.string().min(2),
  itemSerialNumber: z.string().min(5),
  quantity: z.number().default(1),
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
      // Fields no longer used
      model: '', 
      description: '',
      barcode: '',
      tags: [],
    });
    
    revalidatePath('/dashboard/equipment');

    return {
      success: true,
      data: {
        id: newEquipmentDocRef.id,
        model: itemType,
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
