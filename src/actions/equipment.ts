'use server';

import { z } from 'zod';
import { collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateItemTags, GenerateItemTagsInput, GenerateItemTagsOutput } from '@/ai/flows/generate-item-tags';
import { revalidatePath } from 'next/cache';

const AddEquipmentSchema = z.object({
  itemType: z.string().min(2),
  itemModel: z.string().min(2),
  itemSerialNumber: z.string().min(5),
  itemDescription: z.string().optional(),
});

type AddEquipmentInput = z.infer<typeof AddEquipmentSchema>;

export async function addEquipment(input: AddEquipmentInput) {
  try {
    const validation = AddEquipmentSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: 'Invalid input.' };
    }

    const { itemType, itemModel, itemSerialNumber, itemDescription } = validation.data;

    // 1. Add base equipment data to Firestore
    const equipmentCollection = collection(db, 'equipment');
    const newEquipmentDocRef = await addDoc(equipmentCollection, {
      type: itemType,
      model: itemModel,
      serialNumber: itemSerialNumber,
      description: itemDescription || '',
      barcode: '', // Barcode would be added here
      status: 'available',
      tags: [],
      createdAt: serverTimestamp(),
    });

    // 2. Generate tags using the GenAI flow
    let tags: string[] = [];
    try {
      const aiInput: GenerateItemTagsInput = {
        itemType,
        itemModel,
        itemSerialNumber,
        itemDescription,
      };
      const aiOutput: GenerateItemTagsOutput = await generateItemTags(aiInput);
      tags = aiOutput.tags;

      // 3. Update the document with the generated tags
      await updateDoc(newEquipmentDocRef, {
        tags: tags,
      });
    } catch (aiError) {
      console.error('AI tag generation failed:', aiError);
      // Don't fail the whole operation if AI fails, just log it.
      // The equipment is still saved.
    }
    
    // Revalidate path to show new equipment in the list
    revalidatePath('/dashboard/equipment');

    return {
      success: true,
      data: {
        id: newEquipmentDocRef.id,
        model: itemModel,
        tags: tags,
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
