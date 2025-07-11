
'use client';

import Link from 'next/link';
import { PlusCircle, File, ChevronDown } from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Equipment } from '@/lib/types';
import { Icons } from '@/components/icons';

type TemplateType = 'blank' | 'delivery' | 'return' | 'scrap';

export default function EquipmentPage() {
  const { equipmentList, loading } = useEquipment();

  const handleExportPDF = async (template: TemplateType) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const margin = 50;
    let y = height - margin;

    const drawText = (text: string, x: number, yPos: number, options: { font?: any; size?: number; color?: any } = {}) => {
      page.drawText(text, {
        x,
        y: yPos,
        font: options.font || font,
        size: options.size || 10,
        color: options.color || rgb(0, 0, 0),
      });
    };

    const today = new Date();
    const dateStr = `${today.getDate()} días del mes de ${today.toLocaleString('es-ES', { month: 'long' })} del año ${today.getFullYear()}`;
    const dateTimeStr = today.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

    // --- TEMPLATE SPECIFIC LOGIC ---
    if (template === 'blank') {
      drawText('Equipment List', margin, y, { font: boldFont, size: 18 });
      y -= 30;
      // Table Headers
      drawText('Type', margin, y, { font: boldFont, size: 12 });
      drawText('Serial Number', 200, y, { font: boldFont, size: 12 });
      drawText('Quantity', 450, y, { font: boldFont, size: 12 });
      y -= 20;
       page.drawLine({ start: { x: margin, y: y + 10 }, end: { x: width - margin, y: y + 10 }, thickness: 1 });
      // Table Rows
      equipmentList.forEach((item) => {
        drawText(item.type, margin, y);
        drawText(item.serialNumber, 200, y);
        drawText(item.quantity.toString(), 450, y);
        y -= 20;
      });

    } else {
        drawText('ANKAE S.A.C.', margin, y, { font: boldFont, size: 14 });
        y -= 20;

        let title = '';
        if (template === 'delivery') title = 'ACTA DE ENTREGA DE EQUIPOS A TÉCNICO';
        if (template === 'return') title = 'ACTA DE DEVOLUCIÓN DE EQUIPOS';
        if (template === 'scrap') title = 'ACTA DE ENTREGA DE EQUIPOS DECLARADOS COMO CHATARRA';
        
        drawText(title, margin, y, { font: boldFont, size: 12 });
        y -= 25;

        const city = template === 'scrap' ? 'Trujillo' : 'Lima';
        drawText(`En la ciudad de ${city}, a los ${dateStr}, se deja constancia de lo siguiente:`, margin, y);
        y -= 25;

        if (template === 'delivery' || template === 'return') {
            drawText('TÉCNICO:', margin, y, { font: boldFont });
            y -= 15;
            drawText('Nombre Completo: [NOMBRE_TECNICO]', margin, y);
            y -= 15;
            drawText('DNI: [DNI_TECNICO]', margin, y);
            y -= 15;
            if (template === 'delivery') drawText('Código / ID: [ID_TECNICO]', margin, y);
        } else { // scrap
             drawText('ENTREGADO POR:', margin, y, { font: boldFont });
            y -= 15;
            drawText('Nombre: ', margin, y);
            y -= 15;
            drawText('Cargo: ', margin, y);
            y -= 15;
            drawText('DNI: ', margin, y);
        }
        y -= 25;

        // Table headers
        let headers = [];
        if (template === 'delivery') headers = ['Nº', 'Tipo de Equipo', 'Marca / Modelo', 'N° de Serie', 'Cantidad'];
        if (template === 'return') headers = ['Nº', 'Tipo de Equipo', 'Marca / Modelo', 'N° de Serie', 'Estado', 'Cantidad'];
        if (template === 'scrap') headers = ['Nº', 'Tipo de Equipo', 'Modelo', 'N° de Serie', 'Motivo de Baja', 'Cantidad'];
        
        const colWidths = [30, 150, 150, 150, 80, 80];
        let currentX = margin;

        headers.forEach((header, i) => {
            drawText(header, currentX, y, { font: boldFont });
            currentX += colWidths[i];
        });
        y -= 20;
        page.drawLine({ start: { x: margin, y: y + 10 }, end: { x: width - margin, y: y + 10 }, thickness: 1 });

        // Table content
        equipmentList.forEach((item, index) => {
            currentX = margin;
            drawText((index + 1).toString(), currentX, y); currentX += colWidths[0];
            drawText(item.type, currentX, y); currentX += colWidths[1];
            drawText('[MODELO]', currentX, y); currentX += colWidths[2]; // Placeholder for model
            drawText(item.serialNumber, currentX, y); currentX += colWidths[3];
            
            if (template === 'return') {
                drawText('[ESTADO]', currentX, y); currentX += colWidths[4]; // Placeholder for status
            }
            if (template === 'scrap') {
                drawText('[MOTIVO]', currentX, y); currentX += colWidths[4]; // Placeholder for reason
            }
            drawText(item.quantity.toString(), currentX, y);
            
            y -= 20;
        });
        y -= 25;

        drawText('OBSERVACIONES:', margin, y, { font: boldFont });
        y -= 15;
        const observations = template === 'scrap' ? '' : '[Sin observaciones]';
        drawText(observations, margin, y);
        y -= 40;

        // Signatures
        const sig1Label = template === 'delivery' || template === 'scrap' ? 'FIRMA DE ENTREGA:' : 'FIRMA DE DEVOLUCIÓN:';
        const sig2Label = 'FIRMA DE RECEPCIÓN:';

        const sig1Name = template === 'delivery' ? '[NOMBRE_TECNICO]' : template === 'scrap' ? '' : '[NOMBRE_TECNICO]';
        const sig2Name = template === 'delivery' ? '[NOMBRE_RESPONSABLE]' : template === 'scrap' ? '' : '[RESPONSABLE DE ALMACÉN]';

        const sig1DNI = template === 'delivery' ? 'DNI: [DNI_TECNICO]' : template === 'scrap' ? 'DNI: ' : 'DNI: [DNI_TECNICO]';
        const sig2DNI = template === 'scrap' ? 'DNI: ' : 'DNI: [DNI_RESPONSABLE]';

        drawText(sig1Label, margin, y);
        drawText(sig2Label, width / 2 + 20, y);
        y -= 50;
        drawText('_________________________', margin, y);
        drawText('_________________________', width / 2 + 20, y);
        y -= 15;
        drawText(sig1Name, margin, y);
        drawText(sig2Name, width / 2 + 20, y);
        y -= 15;
        drawText(sig1DNI, margin, y);
        drawText(sig2DNI, width / 2 + 20, y);
        y -= 25;
        
        drawText(`Fecha y Hora: ${dateTimeStr}`, margin, y);
    }
    

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `acta-${template}-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Equipment</CardTitle>
          <CardDescription>Manage your inventory and view their status.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 gap-1" disabled={equipmentList.length === 0}>
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExportPDF('blank')}>Blank List</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPDF('delivery')}>Delivery to Technician</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPDF('return')}>Return from Technician</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPDF('scrap')}>Scrap Equipment</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard/equipment/new">
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Equipment
                </span>
              </Button>
            </Link>
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <Icons.spinner className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : equipmentList.length === 0 ? (
               <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No equipment found. Add some in the "Add Item" page.
                </TableCell>
              </TableRow>
            ) : (
              equipmentList.map((item: Equipment) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
