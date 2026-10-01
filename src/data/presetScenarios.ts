import { PresetScenario } from '../types.ts';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'freelance-contract',
    title: 'Freelance Work Contract',
    badge: 'Popular',
    description: 'Jane Doe & TechNova Inc. service provider agreement with IP & milestones',
    formData: {
      documentType: 'Freelance Work Contract',
      parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
      terms:
        'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice',
      dates: 'April 15, 2025',
      jurisdiction: 'State of California',
      companyName: 'TechNova Inc.',
      additionalNotes: 'Include standard independent contractor non-employee tax declaration and cure period.',
    },
  },
  {
    id: 'employment-contract',
    title: 'Startup Employment Contract',
    badge: 'Scenario 1',
    description: 'Startup founder hiring lead engineer with roles, equity, and IP assignment',
    formData: {
      documentType: 'Employment Contract',
      parties: 'Apex Ventures LLC (Employer), Marcus Vance (Employee)',
      terms:
        'Position title: Principal Software Architect; Annual base salary of $165,000 paid bi-weekly; Standard 0.5% equity vesting over 4 years with 1-year cliff; Comprehensive health and dental coverage; Strict IP assignment and non-solicitation for 12 months',
      dates: 'May 1, 2025',
      jurisdiction: 'State of Delaware',
      companyName: 'Apex Ventures LLC',
      additionalNotes: 'Specify at-will employment relationship and 2 weeks standard termination notice.',
    },
  },
  {
    id: 'nda-agreement',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    badge: 'Scenario 2',
    description: 'Bilateral confidentiality for software trade secrets and investor pitch',
    formData: {
      documentType: 'Non-Disclosure Agreement (NDA)',
      parties: 'Solaria AI Corp (Disclosing Party), Nexus Partners Fund (Receiving Party)',
      terms:
        'Confidential information includes proprietary source code, algorithms, and financial projections; Receiving party shall exercise reasonable degree of care; Term of confidentiality extends for 3 years; Excludes publicly known information or court-mandated disclosures; Return or destruction of materials upon written request',
      dates: 'April 10, 2025',
      jurisdiction: 'State of New York',
      companyName: 'Solaria AI Corp',
      additionalNotes: 'Bilateral non-disclosure protection with injunctive relief remedy.',
    },
  },
  {
    id: 'residential-lease',
    title: 'Residential Lease Agreement',
    badge: 'Scenario 3',
    description: 'Landlord & tenant apartment lease with security deposit and maintenance',
    formData: {
      documentType: 'Residential Lease Agreement',
      parties: 'Alice Smith (Tenant), XYZ Realty Management LLC (Landlord)',
      terms:
        'Property address: Apt 4B, 742 Evergreen Terrace, Springfield; Monthly rent of $2,400 due on the first day of each month; Security deposit of $3,600 held in dedicated escrow; Lease term duration of 12 consecutive months; Tenant responsible for electric and internet; No unauthorized alterations or subletting without prior written approval',
      dates: 'June 1, 2025',
      jurisdiction: 'State of Illinois',
      companyName: 'XYZ Realty Management LLC',
      additionalNotes: 'Include standard inspection covenants and late fee clause of 5% after 5-day grace period.',
    },
  },
  {
    id: 'consulting-agreement',
    title: 'Professional Consulting Agreement',
    badge: 'B2B',
    description: 'Advisory engagement with retainer, milestone schedule, and indemnity',
    formData: {
      documentType: 'Consulting Services Agreement',
      parties: 'Beacon Advisory Group (Consultant), Meridian Global Logistics (Client)',
      terms:
        'Monthly advisory retainer of $12,500 for up to 30 hours of strategic guidance; Overtime advisory hours billed at $350 per hour; Invoices payable net 30 days; Consultant acts solely as an independent contractor; Work product rights transfer upon payment in full; Mutual indemnification for gross negligence',
      dates: 'May 15, 2025',
      jurisdiction: 'State of Texas',
      companyName: 'Beacon Advisory Group',
      additionalNotes: 'Explicitly specify non-exclusivity so consultant may advise other non-direct competitors.',
    },
  },
];
