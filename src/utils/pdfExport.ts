import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { sanitize_text } from './sanitizer.ts';

/**
 * Generates and downloads a clean, branded PDF matching PDF Milestone 2.1, 4.2 & pages 23-24
 */
export function download_pdf(
  rawText: string,
  docType: string,
  termsInput?: string
): void {
  const sanitized = sanitize_text(rawText);
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  let y = 50;

  // Function to draw header & footer on all pages
  const addPageDecorations = (pdf: jsPDF) => {
    const totalPages = (pdf.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Header rule and branding on pages after page 1
      if (i > 1) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184); // Slate 400
        pdf.text('LegalEase AI Legal Document', margin, 30);
        pdf.text(docType, pageWidth - margin, 30, { align: 'right' });
        pdf.setDrawColor(226, 232, 240); // Slate 200
        pdf.setLineWidth(0.5);
        pdf.line(margin, 35, pageWidth - margin, 35);
      }

      // Footer matching PDF page 23-24
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139); // Slate 500
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

      const footerText = 'LegalEase Inc. | contact@legalease.com | All Rights Reserved';
      pdf.text(footerText, pageWidth / 2, pageHeight - 22, { align: 'center' });
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 22, {
        align: 'right',
      });
    }
  };

  // Check page overflow helper
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 55) {
      doc.addPage();
      y = 55;
    }
  };

  // Front Page Brand Header (matching PDF page 23)
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('⚖ LegalEase', pageWidth / 2, y, { align: 'center' });
  y += 24;

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text((docType || 'Legal Agreement').toUpperCase(), pageWidth / 2, y, {
    align: 'center',
  });
  y += 25;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 80, y, pageWidth / 2 + 80, y);
  y += 25;

  const lines = sanitized.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    if (!rawLine) {
      y += 8;
      continue;
    }

    // Skip redundant heading if already matched docType at top
    if (
      rawLine.startsWith('## ') &&
      rawLine.toLowerCase().includes(docType.toLowerCase()) &&
      y < 160
    ) {
      continue;
    }

    if (rawLine.startsWith('## ') || rawLine.startsWith('### ')) {
      checkPageBreak(30);
      const heading = rawLine.replace(/^#{2,3}\s*/, '');
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(heading, margin, y);
      y += 18;
    } else if (
      rawLine === 'WITNESSETH:' ||
      rawLine.startsWith('BETWEEN:') ||
      rawLine.startsWith('AND:') ||
      rawLine.startsWith('NOW, THEREFORE')
    ) {
      checkPageBreak(20);
      doc.setFont('times', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text(rawLine, margin, y);
      y += 15;
    } else if (rawLine.startsWith('FIRST PARTY:') || rawLine.startsWith('SECOND PARTY:')) {
      checkPageBreak(70);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(rawLine, margin, y);
      y += 16;
    } else if (rawLine.startsWith('____')) {
      checkPageBreak(25);
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(rawLine, margin, y);
      y += 14;
    } else {
      // Normal legal text
      const isBullet = rawLine.match(/^(\d+\.|\([a-z]\)|[•\-\*])\s+/);
      const indent = isBullet ? 15 : 0;

      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85); // Slate 700

      const wrappedLines = doc.splitTextToSize(rawLine, contentWidth - indent);
      checkPageBreak(wrappedLines.length * 13 + 6);

      doc.text(wrappedLines, margin + indent, y);
      y += wrappedLines.length * 13 + 6;
    }
  }

  // Terms and conditions summary table (as required by PDF page 15)
  const termItems = (termsInput || '')
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (termItems.length > 0) {
    checkPageBreak(100);
    y += 15;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Schedule A: Summary of Agreed Covenants', margin, y);
    y += 10;

    const tableData = termItems.map((item, idx) => [
      `Item ${idx + 1}`,
      item,
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Clause Ref', 'Covenant / Operational Term']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
        font: 'times',
        fontStyle: 'bold',
        fontSize: 9.5,
      },
      styles: {
        font: 'times',
        fontSize: 9,
        textColor: [51, 65, 85],
        cellPadding: 6,
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 'auto' },
      },
      didDrawPage: () => {
        // Keeps pagination synced
      },
    });

    const lastTable = (doc as any).lastAutoTable;
    if (lastTable && lastTable.finalY) {
      y = lastTable.finalY + 20;
    }
  }

  // Final page decorations (headers, footers, page counts)
  addPageDecorations(doc);

  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;
  doc.save(fileName);
}
