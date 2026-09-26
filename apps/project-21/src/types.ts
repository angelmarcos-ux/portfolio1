export type MatterStage =
  | 'Intake'
  | 'Pleadings'
  | 'Discovery'
  | 'Negotiation'
  | 'Trial Prep'
  | 'Closing'

export type MatterPriority = 'Critical' | 'High' | 'Standard'

export interface Matter {
  ref: string
  title: string
  client: string
  practice: string
  lead: string
  stage: MatterStage
  priority: MatterPriority
  docs: number
  unread: number
  nextDeadline: string
  daysLeft: number
  billable: number
  encrypted: boolean
}

export type DocKind =
  | 'Pleading'
  | 'Contract'
  | 'Evidence'
  | 'Correspondence'
  | 'Discovery'
  | 'Identity'

export type DocClassification =
  | 'Attorney-Client Privileged'
  | 'Work Product'
  | 'Client Confidential'
  | 'Public Filing'

export type SignatureState = 'Not Requested' | 'Awaiting' | 'Partially Signed' | 'Executed'

export interface VaultDoc {
  id: string
  name: string
  matter: string
  kind: DocKind
  sizeKb: number
  version: number
  updated: string
  sharedWith: number
  signature: SignatureState
  classification: DocClassification
  verified: boolean
}

export interface Thread {
  id: string
  party: string
  role: string
  matter: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  safetyNumber: string
  identityVerified: boolean
  ratchetHealthy: boolean
}

export interface Contact {
  name: string
  role: string
  org: string
  matters: number
  lastContact: string
  channel: 'Signal' | 'Email Bridge' | 'In-App'
  trust: 'Verified' | 'Pending' | 'Unverified'
  mfa: boolean
}

export type Notify = (msg: string, ok?: boolean) => void
