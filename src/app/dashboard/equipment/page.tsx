
'use client';

import Link from 'next/link';
import { PlusCircle, File } from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Equipment } from '@/lib/types';
import { Icons } from '@/components/icons';

export default function EquipmentPage() {
  const { equipmentList, loading } = useEquipment();

  const handleExportPDF = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add a blank page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Set up drawing properties
    const fontSize = 12;
    const titleFontSize = 18;
    const margin = 50;
    let y = height - margin;

    // Draw title
    page.drawText('Equipment List', {
      x: margin,
      y,
      font: helveticaBoldFont,
      size: titleFontSize,
      color: rgb(0, 0, 0),
    });
    y -= titleFontSize + 20;

    // Table Headers
    const tableTop = y;
    const itemX = margin;
    const serialX = 200;
    const quantityX = 450;
    
    page.drawText('Type', { x: itemX, y, font: helveticaBoldFont, size: fontSize });
    page.drawText('Serial Number', { x: serialX, y, font: helveticaBoldFont, size: fontSize });
    page.drawText('Quantity', { x: quantityX, y, font: helveticaBoldFont, size: fontSize });
    y -= 20;
    
    // Draw line under headers
    page.drawLine({
        start: { x: margin, y: y + 10 },
        end: { x: width - margin, y: y + 10 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });


    // Table Rows
    equipmentList.forEach((item) => {
        page.drawText(item.type, { x: itemX, y, font: helveticaFont, size: fontSize });
        page.drawText(item.serialNumber, { x: serialX, y, font: helveticaFont, size: fontSize });
        page.drawText(item.quantity.toString(), { x: quantityX, y, font: helveticaFont, size: fontSize });
        y -= 20;

        // Add a new page if content overflows
        if (y < margin) {
            const newPage = pdfDoc.addPage();
            y = newPage.getSize().height - margin;
        }
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'equipment-list.pdf';
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
            <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleExportPDF} disabled={equipmentList.length === 0}>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
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
