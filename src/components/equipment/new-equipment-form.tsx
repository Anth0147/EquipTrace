'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { addEquipment } from '@/actions/equipment';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Barcode } from 'lucide-react';

const formSchema = z.object({
  itemType: z.string().min(2, 'Type must be at least 2 characters.'),
  itemModel: z.string().min(2, 'Model must be at least 2 characters.'),
  itemSerialNumber: z.string().min(5, 'Serial number must be at least 5 characters.'),
  itemDescription: z.string().optional(),
});

export default function NewEquipmentForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = React.useState(false);
  const [generatedTags, setGeneratedTags] = React.useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: '',
      itemModel: '',
      itemSerialNumber: '',
      itemDescription: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setIsGeneratingTags(true);
    setGeneratedTags([]);

    const result = await addEquipment(values);

    setIsGeneratingTags(false);

    if (result.success && result.data) {
      toast({
        title: 'Equipment Added',
        description: `Successfully added ${result.data.model}.`,
      });
      setGeneratedTags(result.data.tags);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to add equipment.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="itemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Laptop, Server, Monitor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., MacBook Pro 16, Dell XPS 15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemSerialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter unique serial number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any relevant details about the item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Save Equipment
            </Button>
            <Button type="button" variant="outline" disabled>
                <Barcode className="mr-2 h-4 w-4" />
                Scan Barcode
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>AI-Generated Tags</CardTitle>
                <CardDescription>
                AI will generate descriptive tags here to help you find this item later.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isGeneratingTags && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Icons.spinner className="h-4 w-4 animate-spin"/>
                        <span>Generating tags...</span>
                    </div>
                )}
                {generatedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {generatedTags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                )}
                {!isGeneratingTags && generatedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tags will appear here after saving.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
