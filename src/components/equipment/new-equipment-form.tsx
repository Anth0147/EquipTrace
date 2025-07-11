
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { addEquipment } from '@/actions/equipment';
import { Barcode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
  itemType: z.string().min(2, 'El tipo de equipo debe tener al menos 2 caracteres.'),
  itemSerialNumber: z.string().min(5, 'El número de serie debe tener al menos 5 caracteres.'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
});

const SCANNER_REGION_ID = 'html5qr-code-full-region';

export default function NewEquipmentForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const scannerRef = React.useRef<Html5QrcodeScanner | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: '',
      itemSerialNumber: '',
      quantity: 1,
    },
  });

  const cleanupScanner = React.useCallback(() => {
    if (scannerRef.current) {
        try {
            scannerRef.current.clear();
            scannerRef.current = null;
        } catch (error) {
            // console.error("Failed to clear scanner", error);
        }
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsScannerOpen(open);
    if (!open) {
      cleanupScanner();
    }
  };

  React.useEffect(() => {
    if (isScannerOpen) {
      if (!document.getElementById(SCANNER_REGION_ID)) return;
      
      const scanner = new Html5QrcodeScanner(
        SCANNER_REGION_ID,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        form.setValue('itemSerialNumber', decodedText);
        toast({
          title: 'Código escaneado',
          description: `Número de serie detectado: ${decodedText}`,
        });
        handleOpenChange(false);
      };

      const onScanFailure = (error: any) => {
        // console.warn(`Code scan error = ${error}`);
      };
      
      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      cleanupScanner();
    };
  }, [isScannerOpen, form, toast, cleanupScanner]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const result = await addEquipment(values);
    if (result.success && result.data) {
      toast({
        title: 'Equipo Añadido',
        description: `Se ha añadido correctamente ${result.data.itemType}.`,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al Añadir',
        description: result.error || 'No se pudo añadir el equipo.',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="itemType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Tipo de Equipo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Laptop, Servidor, Monitor" {...field} />
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
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Introduzca el número de serie único" {...field} />
                </FormControl>
                <Dialog open={isScannerOpen} onOpenChange={handleOpenChange}>
                    <Button type="button" variant="outline" size="icon" onClick={() => setIsScannerOpen(true)}>
                        <Barcode className="h-4 w-4" />
                        <span className="sr-only">Escanear Código</span>
                    </Button>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Escanear Código de Barras</DialogTitle>
                        <DialogDescription>
                          Apunta la cámara al código de barras o QR para rellenar el número de serie.
                        </DialogDescription>
                      </DialogHeader>
                      <div id={SCANNER_REGION_ID} className="w-full"/>
                      <DialogFooter>
                          <DialogClose asChild>
                              <Button type="button" variant="secondary">Cerrar</Button>
                          </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
        </div>
      </form>
    </Form>
  );
}
