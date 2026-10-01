import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
} from 'docx';
import { sanitize_text } from './sanitizer.ts';

/**
 * Formats and downloads an authentic .docx file matching PDF Milestone 2.1 & 4.2
 */
export async function download_docx(
  rawText: string,
  docType: string,
  termsInput?: string
): Promise<void> {
  const sanitized = sanitize_text(rawText);
  const lines = sanitized.split('\n');

  // Parse terms for the special Terms Table required by PDF page 15
  const termItems = (termsInput || '')
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const paragraphs: (Paragraph | Table)[] = [];

  // Top Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: '⚖ LegalEase',
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman',
          color: '1E293B',
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 },
      children: [
        new TextRun({
          text: (docType || 'Legal Agreement').toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman',
          color: '0F172A',
        }),
      ],
    })
  );

  // Process markdown/text lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          children: [],
        })
      );
      continue;
    }

    // Skip redundant title line if already in document top
    if (
      line.startsWith('## ') &&
      line.toLowerCase().includes(docType.toLowerCase()) &&
      paragraphs.length <= 4
    ) {
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('### ')) {
      const headingText = line.replace(/^#{2,3}\s*/, '');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 24, // 12pt
              font: 'Times New Roman',
              color: '1E293B',
            }),
          ],
        })
      );
    } else if (line.match(/^(\d+\.|\([a-z]\)|[•\-\*])\s+/)) {
      // Numbered or bullet list item
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          indent: { left: 400 },
          children: [
            new TextRun({
              text: line,
              size: 22, // 11pt
              font: 'Times New Roman',
              color: '1E293B',
            }),
          ],
        })
      );
    } else if (
      line === 'WITNESSETH:' ||
      line.startsWith('BETWEEN:') ||
      line.startsWith('AND:') ||
      line.startsWith('NOW, THEREFORE')
    ) {
      // Emphasized legal transitions
      paragraphs.push(
        new Paragraph({
          spacing: { before: 160, after: 80 },
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 22,
              font: 'Times New Roman',
            }),
          ],
        })
      );
    } else {
      // Standard legal paragraph
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 100, after: 100, line: 276 }, // 1.15 line spacing
          children: [
            new TextRun({
              text: line,
              size: 22, // 11pt
              font: 'Times New Roman',
              color: '1E293B',
            }),
          ],
        })
      );
    }
  }

  // Auto-generate Terms Table as required by PDF page 15 ("Auto-generate a Terms table from semicolon-separated input")
  if (termItems.length > 0) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 140 },
        children: [
          new TextRun({
            text: 'Schedule A: Key Terms and Covenants Summary',
            bold: true,
            size: 24,
            font: 'Times New Roman',
            color: '1E293B',
          }),
        ],
      })
    );

    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Clause',
                    bold: true,
                    size: 20,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Agreed Covenant / Operational Term',
                    bold: true,
                    size: 20,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...termItems.map(
        (term, index) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Item ${index + 1}`,
                        bold: true,
                        size: 20,
                        font: 'Times New Roman',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: term,
                        size: 20,
                        font: 'Times New Roman',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    ];

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      })
    );
  }

  // Create docx document with header and footer matching PDF page 22 & 23
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'LegalEase AI Legal Document',
                    size: 16,
                    color: '94A3B8',
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'LegalEase Inc. | contact@legalease.com | All Rights Reserved',
                    size: 16,
                    color: '64748B',
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.docx`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
