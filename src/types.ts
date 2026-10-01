export interface DocumentFormData {
  documentType: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction: string;
  additionalNotes?: string;
  companyName?: string;
}

export interface PresetScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  formData: DocumentFormData;
}

export interface GeneratedDocumentItem {
  id: string;
  createdAt: string;
  title: string;
  documentType: string;
  parties: string;
  dates: string;
  terms: string;
  content: string;
  summary?: string;
}
