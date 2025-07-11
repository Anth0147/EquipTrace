'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Html5QrcodeScanner, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { addEquipment } from '@/actions/equipment';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Barcode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
  itemType: z.string().min(2, 'El tipo debe tener al menos 2 caracteres.'),
  itemSerialNumber: z.string().min(5, 'El número de serie debe tener al menos 5 caracteres.'),
});

const SCANNER_REGION_ID = 'bar-code-scanner-region';

export default function NewEquipmentForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = React.useState(false);
  const [generatedTags, setGeneratedTags] = React.useState<string[]>([]);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: '',
      itemSerialNumber: '',
    },
  });

  React.useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    const scanner = new Html5QrcodeScanner(
      SCANNER_REGION_ID,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText: string, result: Html5QrcodeResult) => {
      form.setValue('itemSerialNumber', decodedText);
      toast({
        title: 'Código escaneado',
        description: `Número de serie detectado: ${decodedText}`,
      });
      setIsScannerOpen(false);
      scanner.clear();
    };

    const onScanFailure = (error: Html5QrcodeError) => {
        // console.warn(`Code scan error = ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
        // Cleanup function to clear the scanner instance
        if (scanner) {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode-scanner.", error);
            });
        }
    };
  }, [isScannerOpen, form, toast]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setIsGeneratingTags(true);
    setGeneratedTags([]);

    const result = await addEquipment(values);

    setIsGeneratingTags(false);

    if (result.success && result.data) {
      toast({
        title: 'Equipo Añadido',
        description: `Se ha añadido correctamente ${result.data.model}.`,
      });
      setGeneratedTags(result.data.tags);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'No se pudo añadir el equipo.',
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
                <FormLabel>Nombre / Tipo</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Portátil, Servidor, Monitor" {...field} />
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
                <FormLabel>Número de Serie</FormLabel>
                <FormControl>
                  <Input placeholder="Introduzca el número de serie único" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Equipo
            </Button>
             <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
              <Button type="button" variant="outline" onClick={() => setIsScannerOpen(true)}>
                  <Barcode className="mr-2 h-4 w-4" />
                  Escanear Código
              </Button>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Escanear Código de Barras</DialogTitle>
                  <DialogDescription>
                    Apunta la cámara al código de barras o QR para rellenar el número de serie.
                  </DialogDescription>
                </DialogHeader>
                <div id={SCANNER_REGION_ID} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Etiquetas generadas por IA</CardTitle>
                <CardDescription>
                La IA generará aquí etiquetas descriptivas para ayudarte a encontrar este artículo más tarde.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isGeneratingTags && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Icons.spinner className="h-4 w-4 animate-spin"/>
                        <span>Generando etiquetas...</span>
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
                    <p className="text-sm text-muted-foreground">Las etiquetas aparecerán aquí después de guardar.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
