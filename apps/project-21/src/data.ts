import type { Contact, Matter, Thread, VaultDoc } from './types'

export const matters: Matter[] = [
  { ref: 'LTC-2411', title: 'Vance v. Northbridge Logistics', client: 'Vance Holdings', practice: 'Commercial Litigation', lead: 'A. Reyes', stage: 'Trial Prep', priority: 'Critical', docs: 184, unread: 7, nextDeadline: 'Exhibit B — objections due', daysLeft: 3, billable: 41250, encrypted: true },
  { ref: 'LTC-2398', title: 'Ardent IP — Patent Infringement', client: 'Ardent Semiconductor', practice: 'Intellectual Property', lead: 'A. Reyes', stage: 'Discovery', priority: 'High', docs: 412, unread: 2, nextDeadline: 'Respond to RFP set 3', daysLeft: 9, billable: 88900, encrypted: true },
  { ref: 'LTC-2437', title: 'Meridian Trust — Estate Plan', client: 'Meridian Family Office', practice: 'Trusts & Estates', lead: 'K. Osei', stage: 'Closing', priority: 'Standard', docs: 46, unread: 0, nextDeadline: 'Execute revocable trust', daysLeft: 14, billable: 12400, encrypted: true },
  { ref: 'LTC-2402', title: 'Solstice Health — HIPAA Breach', client: 'Solstice Health Group', practice: 'Regulatory & Data Privacy', lead: 'K. Osei', stage: 'Pleadings', priority: 'Critical', docs: 233, unread: 11, nextDeadline: 'HHS breach report — 60d', daysLeft: 6, billable: 67300, encrypted: true },
  { ref: 'LTC-2445', title: 'Castellan Group — M&A Rollup', client: 'Castellan Group', practice: 'Corporate & M&A', lead: 'D. Whitfield', stage: 'Negotiation', priority: 'High', docs: 128, unread: 1, nextDeadline: 'Term sheet — counter', daysLeft: 2, billable: 52750, encrypted: true },
  { ref: 'LTC-2386', title: 'Okonkwo v. Bayline Insurance', client: 'Okonkwo (individual)', practice: 'Personal Injury', lead: 'D. Whitfield', stage: 'Negotiation', priority: 'Standard', docs: 71, unread: 0, nextDeadline: 'Mediation brief', daysLeft: 21, billable: 19800, encrypted: true },
  { ref: 'LTC-2451', title: 'Pelham Zoning Appeal', client: 'Pelham Civic Assn.', practice: 'Land Use & Zoning', lead: 'A. Reyes', stage: 'Intake', priority: 'Standard', docs: 19, unread: 3, nextDeadline: 'File appeal — 30d window', daysLeft: 26, billable: 4300, encrypted: false },
  { ref: 'LTC-2364', title: 'Cobalt Energy — Arbitration', client: 'Cobalt Energy Partners', practice: 'Arbitration', lead: 'K. Osei', stage: 'Trial Prep', priority: 'High', docs: 297, unread: 4, nextDeadline: 'Witness statements filed', daysLeft: 8, billable: 95600, encrypted: true },
  { ref: 'LTC-2456', title: 'Ferraro Employment Separation', client: 'Ferraro (individual)', practice: 'Employment', lead: 'D. Whitfield', stage: 'Pleadings', priority: 'Standard', docs: 24, unread: 0, nextDeadline: 'Answer complaint — 21d', daysLeft: 18, billable: 8750, encrypted: true },
  { ref: 'LTC-2379', title: 'Dunmore Lease Dispute', client: 'Dunmore Properties', practice: 'Real Estate', lead: 'A. Reyes', stage: 'Discovery', priority: 'Standard', docs: 88, unread: 5, nextDeadline: 'Produce lease exhibits', daysLeft: 12, billable: 21600, encrypted: true },
]

export const vaultDocs: VaultDoc[] = [
  { id: 'DOC-8814', name: 'Third Amended Complaint.pdf', matter: 'LTC-2402', kind: 'Pleading', sizeKb: 2840, version: 4, updated: '12 min ago', sharedWith: 3, signature: 'Executed', classification: 'Public Filing', verified: true },
  { id: 'DOC-8802', name: 'Expert Report — Dr. I. Osei.pdf', matter: 'LTC-2411', kind: 'Evidence', sizeKb: 11200, version: 2, updated: '48 min ago', sharedWith: 5, signature: 'Not Requested', classification: 'Work Product', verified: true },
  { id: 'DOC-8796', name: 'Master Services Agreement.pdf', matter: 'LTC-2445', kind: 'Contract', sizeKb: 960, version: 7, updated: '2 hours ago', sharedWith: 6, signature: 'Partially Signed', classification: 'Client Confidential', verified: true },
  { id: 'DOC-8791', name: 'RFP Set 3 — Responses.zip', matter: 'LTC-2398', kind: 'Discovery', sizeKb: 48200, version: 1, updated: '3 hours ago', sharedWith: 2, signature: 'Not Requested', classification: 'Attorney-Client Privileged', verified: true },
  { id: 'DOC-8785', name: 'Revocable Trust — Draft B.pdf', matter: 'LTC-2437', kind: 'Contract', sizeKb: 1420, version: 3, updated: '5 hours ago', sharedWith: 4, signature: 'Awaiting', classification: 'Client Confidential', verified: true },
  { id: 'DOC-8777', name: 'Mediation Statement.pdf', matter: 'LTC-2386', kind: 'Correspondence', sizeKb: 610, version: 1, updated: 'Yesterday', sharedWith: 2, signature: 'Executed', classification: 'Work Product', verified: true },
  { id: 'DOC-8770', name: 'Arbitrator Disclosure Form.pdf', matter: 'LTC-2364', kind: 'Pleading', sizeKb: 380, version: 2, updated: 'Yesterday', sharedWith: 8, signature: 'Partially Signed', classification: 'Public Filing', verified: true },
  { id: 'DOC-8762', name: 'Device Forensic Report.pdf', matter: 'LTC-2402', kind: 'Evidence', sizeKb: 22600, version: 5, updated: '2 days ago', sharedWith: 3, signature: 'Not Requested', classification: 'Attorney-Client Privileged', verified: true },
  { id: 'DOC-8755', name: 'KYC — Identity Bundle.zip', matter: 'LTC-2445', kind: 'Identity', sizeKb: 5400, version: 1, updated: '2 days ago', sharedWith: 6, signature: 'Executed', classification: 'Client Confidential', verified: true },
  { id: 'DOC-8748', name: 'Zoning Appeal Notice.pdf', matter: 'LTC-2451', kind: 'Pleading', sizeKb: 240, version: 1, updated: '3 days ago', sharedWith: 1, signature: 'Awaiting', classification: 'Public Filing', verified: false },
  { id: 'DOC-8741', name: 'Lease Exhibits A–F.zip', matter: 'LTC-2379', kind: 'Discovery', sizeKb: 15900, version: 2, updated: '4 days ago', sharedWith: 4, signature: 'Not Requested', classification: 'Client Confidential', verified: true },
  { id: 'DOC-8733', name: 'Separation Agreement.pdf', matter: 'LTC-2456', kind: 'Contract', sizeKb: 520, version: 1, updated: '5 days ago', sharedWith: 2, signature: 'Awaiting', classification: 'Client Confidential', verified: true },
]

export const threads: Thread[] = [
  { id: 'TH-01', party: 'Dana Whitfield', role: 'Partner — Litigation', matter: 'LTC-2411', lastMessage: 'Exhibit objections are in — reviewer access granted.', time: '2 min', unread: 2, online: true, safetyNumber: '88431 20577 61902', identityVerified: true, ratchetHealthy: true },
  { id: 'TH-02', party: 'Marisol Vance', role: 'Client — Vance Holdings', matter: 'LTC-2411', lastMessage: 'Uploading the courier receipts you asked for.', time: '18 min', unread: 1, online: true, safetyNumber: '20915 77341 88056', identityVerified: true, ratchetHealthy: true },
  { id: 'TH-03', party: 'Kwame Osei', role: 'Partner — Privacy', matter: 'LTC-2402', lastMessage: 'HHS clock starts at disclosure — 54 days left.', time: '1 hr', unread: 4, online: false, safetyNumber: '55190 33418 70265', identityVerified: true, ratchetHealthy: true },
  { id: 'TH-04', party: 'Ardent IP — Outside Counsel', role: 'External counsel (4 seats)', matter: 'LTC-2398', lastMessage: 'RFP set 3 is large; consider a staged production.', time: '3 hr', unread: 0, online: true, safetyNumber: '77301 99025 46138', identityVerified: true, ratchetHealthy: false },
  { id: 'TH-05', party: 'Talia Brandt', role: 'Client — Castellan Group', matter: 'LTC-2445', lastMessage: 'Board approved the revised term sheet.', time: 'Yesterday', unread: 0, online: false, safetyNumber: '41266 11850 90377', identityVerified: false, ratchetHealthy: true },
  { id: 'TH-06', party: 'Solstice Health — Breach Team', role: 'Client (incident channel)', matter: 'LTC-2402', lastMessage: 'Confirming the affected record count before filing.', time: 'Yesterday', unread: 3, online: true, safetyNumber: '63904 77281 30516', identityVerified: true, ratchetHealthy: true },
]

export const contacts: Contact[] = [
  { name: 'Dana Whitfield', role: 'Partner — Litigation', org: 'LegalTech Connect', matters: 4, lastContact: '2 min ago', channel: 'Signal', trust: 'Verified', mfa: true },
  { name: 'Kwame Osei', role: 'Partner — Privacy & Reg', org: 'LegalTech Connect', matters: 3, lastContact: '1 hr ago', channel: 'Signal', trust: 'Verified', mfa: true },
  { name: 'Priya Raman', role: 'Senior Associate', org: 'LegalTech Connect', matters: 5, lastContact: '3 hr ago', channel: 'In-App', trust: 'Verified', mfa: true },
  { name: 'Marisol Vance', role: 'Client — Vance Holdings', org: 'Vance Holdings', matters: 1, lastContact: '18 min ago', channel: 'Signal', trust: 'Verified', mfa: true },
  { name: 'Talia Brandt', role: 'Client — Castellan Group', org: 'Castellan Group', matters: 1, lastContact: 'Yesterday', channel: 'Email Bridge', trust: 'Pending', mfa: false },
  { name: 'Ardent IP — Outside Counsel', role: 'External counsel', org: 'Hollis & Frye LLP', matters: 1, lastContact: '3 hr ago', channel: 'In-App', trust: 'Pending', mfa: false },
  { name: 'Omar El-Sayed', role: 'Forensic Examiner', org: 'El-Sayed Digital', matters: 2, lastContact: '2 days ago', channel: 'Email Bridge', trust: 'Unverified', mfa: false },
]

export const practiceMix = [
  { name: 'Commercial Litigation', pct: 28, color: '#10b981' },
  { name: 'Privacy & Regulatory', pct: 22, color: '#22d3ee' },
  { name: 'Corporate & M&A', pct: 18, color: '#a78bfa' },
  { name: 'IP & Arbitration', pct: 17, color: '#fbbf24' },
  { name: 'Other', pct: 15, color: '#fb7185' },
]
