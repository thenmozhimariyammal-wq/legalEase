import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Root endpoint matching PDF Milestone 3.1
app.get('/', (req: Request, res: Response, next) => {
  // If request accepts html and in production, pass to next (static/vite)
  if (req.accepts('html') && !req.xhr) {
    return next();
  }
  return res.json({ message: 'Welcome to LegalEase AI Legal Document Generator API' });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'LegalEase AI Legal Document Generator',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Helper for fallback generation if API key is absent or fails
function generateFallbackLegalDocument(params: {
  document_type: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction?: string;
}): string {
  const docType = params.document_type || 'Legal Agreement';
  const parties = params.parties || 'Party A and Party B';
  const date = params.dates || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jurisdiction = params.jurisdiction || 'the State of California';

  // Parse terms from semicolon-separated text
  const termList = (params.terms || '')
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const parsedTerms =
    termList.length > 0
      ? termList
      : [
          'The service provider agrees to deliver services with professional standards and care',
          'Compensation shall be paid upon receipt and verification of approved milestone deliverables',
          'Both parties agree to treat all shared non-public proprietary information as strictly confidential',
          'Either party may terminate this agreement with 14 days written formal notice',
        ];

  const parsedParties = parties.split(',').map((p) => p.trim());
  const party1 = parsedParties[0] || 'First Party ("Client")';
  const party2 = parsedParties[1] || 'Second Party ("Contractor")';

  return `## ${docType.toUpperCase()}

Agreement made this ${date}.

BETWEEN:

${party1}, (hereinafter referred to as the "First Party"),

AND:

${party2}, (hereinafter referred to as the "Second Party").

WITNESSETH:

WHEREAS, the First Party desires to engage the Second Party for legitimate contractual purposes as outlined herein; and

WHEREAS, the Second Party possesses the requisite expertise, authority, and willingness to perform the commitments set forth under this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants, representations, warranties, and promises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. Scope of Engagement and Purpose
The parties agree to carry out the rights, duties, and responsibilities defined under this ${docType}. Each party shall perform its respective duties in good faith, adhering to applicable legal and professional standards.

2. Terms and Operational Conditions
The following fundamental operational covenants are expressly agreed upon:
${parsedTerms.map((t, idx) => `   2.${idx + 1}. ${t}.`).join('\n')}

3. Effective Date and Term
This Agreement shall become fully binding on ${date} (the "Effective Date") and shall remain in full force and effect until the completion of all contractual deliverables or until earlier terminated pursuant to the terms hereof.

4. Confidentiality and Proprietary Information
Both parties covenant that all trade secrets, proprietary workflows, technical documentation, business methods, and related non-public data exchanged shall be maintained in strict confidence and not disclosed to any unauthorized third party without prior written consent.

5. Intellectual Property Rights
Unless otherwise explicitly stated in writing, all deliverables, technical works, and customized outputs created by the Second Party under this Agreement shall belong solely to the First Party upon full settlement of agreed compensation.

6. Representations and Warranties
Each party represents and warrants that it has the full legal power and capacity to execute this Agreement and that entering into this Agreement does not breach any existing obligations or laws.

7. Termination and Cure Period
Either party may terminate this Agreement upon written notification if the other party breaches any material covenant and fails to remedy such default within fifteen (15) calendar days following receipt of written notification.

8. Governing Law and Dispute Resolution
This Agreement shall be construed, interpreted, and governed in accordance with the substantive laws of ${jurisdiction}, without giving effect to any principles of conflicts of law. Any controversy or dispute arising under this Agreement shall be submitted to mediation prior to initiating formal litigation.

9. Severability and Entire Agreement
If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity of the remaining provisions shall not be impaired. This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior negotiations, understandings, and representations.

IN WITNESS WHEREOF, the parties hereto have executed this ${docType} as of the Effective Date written above.

FIRST PARTY:
__________________________________
Authorized Signature
Name: ${party1}
Title: Authorized Representative
Date: ${date}

SECOND PARTY:
__________________________________
Authorized Signature
Name: ${party2}
Title: Authorized Representative
Date: ${date}
`;
}

// POST /generate endpoint matching PDF Milestone 2.2 & 3.2
app.post('/api/generate', async (req: Request, res: Response) => {
  const { document_type, parties, terms, dates, jurisdiction, additional_instructions } = req.body;

  if (!document_type || !parties) {
    return res.status(400).json({
      error: 'Missing required fields: document_type and parties are required.',
    });
  }

  // If Gemini API is available, generate using Google GenAI SDK
  if (ai) {
    try {
      const prompt = `You are a senior legal counsel and contract drafting specialist.
Generate a comprehensive, legally sound, and formal ${document_type}.

Input Details:
- Document Type: ${document_type}
- Involved Parties: ${parties}
- Effective Date: ${dates || 'Current date'}
- Terms & Conditions: ${terms || 'Standard professional legal covenants'}
- Jurisdiction/Governing Law: ${jurisdiction || 'State of California or applicable jurisdiction'}
${additional_instructions ? `- Special Client Instructions: ${additional_instructions}` : ''}

Drafting Requirements:
1. Formal Legal Structure:
   - Header with clear document title (e.g. ## FREELANCE WORK CONTRACT)
   - Date and formal introductory preamble identifying each party, their role, and defined terms (e.g. "Service Provider", "Client", "Landlord", "Tenant")
   - Recitals ("WITNESSETH:" and "WHEREAS..." clauses establishing legitimate business purpose)
   - Operative Sections with clear numbered headings (e.g. 1. Services & Deliverables, 2. Terms & Key Covenants, 3. Compensation & Invoicing, 4. Intellectual Property & Ownership, 5. Confidentiality & Non-Disclosure, 6. Term & Termination, 7. Representations & Warranties, 8. Indemnification & Limitation of Liability, 9. Governing Law & Dispute Resolution, 10. Miscellaneous & Entire Agreement).
   - Detailed and comprehensive clauses tailored specifically to the user's provided terms & conditions.
   - Formal Signature Execution Block for all parties with signature lines, printed name, title, and date.
2. Tone: Authoritative, clear, professional, protective, and legally precise.
3. Clean markdown format without conversational filler. Start directly with the document heading.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          topP: 0.9,
        },
      });

      const generatedText = response.text || '';
      if (generatedText.trim().length > 0) {
        return res.json({
          document: generatedText,
          source: 'gemini-ai',
          model: 'gemini-3.8-flash',
        });
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to built-in legal engine:', err?.message || err);
      // Fall through to fallback engine
    }
  }

  // Fallback generation
  const fallbackDocument = generateFallbackLegalDocument({
    document_type,
    parties,
    terms,
    dates,
    jurisdiction,
  });

  return res.json({
    document: fallbackDocument,
    source: 'legal-engine-template',
  });
});

// POST /api/simplify - Plain-language legal analysis (as per PDF Conclusion page 25)
app.post('/api/simplify', async (req: Request, res: Response) => {
  const { document_text } = req.body;
  if (!document_text) {
    return res.status(400).json({ error: 'document_text is required' });
  }

  if (ai) {
    try {
      const prompt = `Analyze this legal document and provide a clear, plain-language summary for non-lawyers:
1. One-paragraph plain English summary of what this agreement does.
2. Key Obligations for each party (bullet points).
3. Critical Clauses & Protection highlights (payment terms, IP rights, confidentiality, termination).
4. Potential Risk Flags or items to review carefully.

Document Text:
${document_text.slice(0, 8000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ summary: response.text || 'Analysis complete.' });
    } catch (err: any) {
      console.warn('AI analysis error:', err?.message);
    }
  }

  // Fallback summary
  return res.json({
    summary: `### Plain-Language Document Summary\n\nThis legal agreement formally documents the contractual relationship between the named parties, defining the deliverables, responsibilities, payment structure, and governance.\n\n**Key Highlights:**\n- Clarifies roles and expectations for both parties\n- Establishes confidentiality and intellectual property safeguards\n- Outlines termination conditions and notice periods\n- Protects against unauthorized disclosure and specifies governing law.`,
  });
});

// POST /api/enhance-clause - Suggest stronger or alternative clauses
app.post('/api/enhance-clause', async (req: Request, res: Response) => {
  const { clause_text, enhancement_type } = req.body;
  if (!clause_text) {
    return res.status(400).json({ error: 'clause_text is required' });
  }

  if (ai) {
    try {
      const prompt = `You are a contract drafting attorney. Rewrite or enhance the following legal clause based on the requested goal: "${enhancement_type || 'strengthen protection and clarity'}".
Provide 2 alternatives:
1. Comprehensive / Protective Version
2. Mutual / Balanced Version

Original Clause:
${clause_text}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ result: response.text || '' });
    } catch (err: any) {
      console.warn('AI enhance clause error:', err?.message);
    }
  }

  return res.json({
    result: `### Enhanced Clause Alternative\n\n${clause_text}\n\n*Note: Ensure all specific operational deadlines and payment cure periods are explicitly numbered to prevent ambiguities.*`,
  });
});

// Setup Vite middlewares for development, or static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LegalEase Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
