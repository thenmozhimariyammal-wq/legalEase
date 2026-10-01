/**
 * Sanitizes legal document text according to LegalEase specification:
 * Removes mismatched typographic smart quotes, unescaped escape sequences,
 * and ensures clean normalized punctuation and whitespace for PDF/DOCX rendering.
 */
export function sanitize_text(text: string): string {
  if (!text) return '';

  return text
    // Replace curved single quotes and apostrophes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Replace curved double quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace em-dash and en-dash with standard hyphen/dash
    .replace(/[\u2013\u2014]/g, ' - ')
    // Replace ellipsis
    .replace(/\u2026/g, '...')
    // Replace non-breaking spaces
    .replace(/\u00A0/g, ' ')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove null bytes or weird control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excessive multiple empty lines to max 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
