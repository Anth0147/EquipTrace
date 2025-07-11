// This file is machine-generated - changes may be lost.

'use server';

/**
 * @fileOverview Generates descriptive tags for registered equipment.
 *
 * - generateItemTags - A function to generate tags for an item.
 * - GenerateItemTagsInput - The input type for the generateItemTags function.
 * - GenerateItemTagsOutput - The return type for the generateItemTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItemTagsInputSchema = z.object({
  itemType: z.string().describe('The type of the item (e.g., Laptop, Server, Monitor).'),
  itemModel: z.string().describe('The model of the item (e.g., MacBook Pro 16, Dell XPS 15).'),
  itemSerialNumber: z.string().describe('The serial number of the item.'),
  itemDescription: z.string().optional().describe('Optional description of the item.'),
});
export type GenerateItemTagsInput = z.infer<typeof GenerateItemTagsInputSchema>;

const GenerateItemTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of descriptive tags for the item.'),
});
export type GenerateItemTagsOutput = z.infer<typeof GenerateItemTagsOutputSchema>;

export async function generateItemTags(input: GenerateItemTagsInput): Promise<GenerateItemTagsOutput> {
  return generateItemTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItemTagsPrompt',
  input: {schema: GenerateItemTagsInputSchema},
  output: {schema: GenerateItemTagsOutputSchema},
  prompt: `You are an expert in generating descriptive tags for equipment.

  Based on the item's type, model, serial number, and description (if available), generate a list of descriptive tags that can help identify and categorize the item easily.

  Item Type: {{{itemType}}}
  Item Model: {{{itemModel}}}
  Item Serial Number: {{{itemSerialNumber}}}
  Item Description: {{{itemDescription}}}

  Tags:`, // Ensure the LLM outputs tags in a parsable format (e.g., JSON array).
});

const generateItemTagsFlow = ai.defineFlow(
  {
    name: 'generateItemTagsFlow',
    inputSchema: GenerateItemTagsInputSchema,
    outputSchema: GenerateItemTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
