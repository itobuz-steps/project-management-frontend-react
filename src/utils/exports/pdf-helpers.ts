import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

export type RGB = [number, number, number];
export const BLUE: RGB = [59, 130, 246];
export const SLATE: RGB = [71, 85, 105];
export const DARK: RGB = [15, 23, 42];

export function sectionHeader(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLUE);
  doc.text(label.toUpperCase(), 14, y);
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.25);
  doc.line(14, y + 1.5, 196, y + 1.5);
  return y + 7;
}

export function kvTable(
  doc: jsPDF,
  rows: [string, string][],
  startY: number
): number {
  autoTable(doc, {
    startY,
    body: rows,
    theme: 'plain',
    columnStyles: {
      0: {
        cellWidth: 42,
        fontStyle: 'bold',
        textColor: SLATE,
        fillColor: [248, 250, 252],
      },
      1: { cellWidth: 'auto', textColor: DARK },
    },
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
      overflow: 'linebreak',
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });
  return (doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;
}

export function dataTable(
  doc: jsPDF,
  head: string[],
  body: string[][],
  startY: number
): number {
  if (!body.length) {
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text('None recorded.', 18, startY + 5);
    return startY + 12;
  }
  autoTable(doc, {
    startY,
    head: [head],
    body,
    theme: 'striped',
    headStyles: {
      fillColor: BLUE,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5, textColor: DARK },
    styles: {
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
      overflow: 'linebreak',
    },
    margin: { left: 14, right: 14 },
  });
  return (doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;
}

export function maybeNewPage(doc: jsPDF, y: number, needed = 35): number {
  if (y + needed > 276) {
    doc.addPage();
    return 20;
  }
  return y;
}
