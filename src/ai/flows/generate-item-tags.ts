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
  itemSerialNumber: z.string().describe('The serial number of the item.'),
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

  Based on the item's type and serial number, generate a list of descriptive tags that can help identify and categorize the item easily.

  Item Type: {{{itemType}}}
  Item Serial Number: {{{itemSerialNumber}}}

  Tags:`,
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
