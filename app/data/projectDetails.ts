export interface ProjectDetail {
  purpose: string
  problem: string
  features: string[]
  architecture: string
}

export const projectDetails: Record<string, ProjectDetail> = {
  medicare: {
    purpose:
      'A patient-facing portal where people and care coordinators handle appointments, claims, prescriptions and medical records in one place — with protected health information treated as sensitive by default rather than as an afterthought.',
    problem:
      'Healthcare administration is scattered across paper forms, phone calls and ordinary email. That creates slow claims processing, no reliable audit trail, and a real risk of exposing PHI. Most portals bolt security on afterwards; this one designs the access model around it from the first screen.',
    features: [
      'Role-based access control scoped to each patient record',
      'Multi-factor authentication on every account',
      'Encrypted document exchange for lab results and referrals',
      'Appointment scheduling and reminders',
      'Claims tracking with status history',
      'Immutable audit log of every record access',
    ],
    architecture:
      'React + TypeScript frontend with strict authorization checks mirrored on the server. Health data is encrypted in transit and at rest, and every read is written to an append-only audit trail.',
  },

  '3d-print-hub': {
    purpose:
      'A two-sided marketplace that connects people who have a 3D model with printer owners nearby who have the machine and the filament to produce it.',
    problem:
      'Home printer owners have idle capacity but no reliable demand, and makers cannot easily find local machines they can trust. The bottleneck is coordination, not the hardware.',
    features: [
      'Model upload with sliced-layer previews before committing',
      'Printer owner profiles with machine specs and lead times',
      'Real-time progress monitoring per print job',
      'QA photo approval before an order is released',
      'Transparent pricing set by the printer owner',
      'Threaded messaging between maker and owner',
    ],
    architecture:
      'TypeScript and React front end over a Supabase backend, using Postgres row-level security to keep each maker visible only to the owner fulfilling their job.',
  },

  'project-1': {
    purpose:
      'An institutional-grade crypto trading terminal that lets a desk evaluate and execute positions against a continuously running simulated order feed.',
    problem:
      'Most retail trading tools are toy-grade. You cannot judge a strategy on them because they have no real depth, no position accounting and no execution feedback — so people size positions on intuition instead of evidence.',
    features: [
      'Candlestick charts with integrated volume',
      'Depth-10 order book with live spread',
      'AI sentiment engine scoring market narrative',
      'Paper trading for equity, positions and exposure',
      'Realized and unrealized P&L tracking',
      'Timestamped execution and fill feed',
    ],
    architecture:
      'React and TypeScript on Vite, charting via Lightweight Charts. A simulated matching engine on the client produces a continuous order stream, so the UI is exercised under realistic tick volume rather than static fixtures.',
  },

  'project-2': {
    purpose:
      'A mobile health tracker that analyses sleep on-device and returns personalised coaching, so people see a recovery score and something concrete to act on.',
    problem:
      'Wearables emit a large volume of raw, clinically flat data. Users collect it, stare at it, and still do not know which of their habits to change — the interpretation step is the missing piece.',
    features: [
      'On-device ML inference via TensorFlow Lite',
      'Sleep stage classification across the night',
      'Recovery and readiness scoring each morning',
      'Personalised recommendations that update over time',
      'Trend dashboards for sleep, resting heart rate and HRV',
      'No raw health data leaves the handset',
    ],
    architecture:
      'React Native for the client with models bundled and executed locally, backed by a Node.js service that handles account sync and long-term trend storage without ever seeing live sensor streams.',
  },

  'project-3': {
    purpose:
      'A supply chain engine that forecasts where routes will break and how much a reroute saves, across a global multi-leg network.',
    problem:
      'Carriers react to disruption after it happens. Because the response is manual and late, the cost of a bad leg compounds through every downstream handoff before anyone corrects the plan.',
    features: [
      'Deep learning models for ETA and disruption risk',
      'Route optimisation across multi-leg shipments',
      'Early exception alerting before a leg is missed',
      'End-to-end visibility from origin to final delivery',
      'Cost simulation comparing candidate routes',
      'Carrier and lane performance analytics',
    ],
    architecture:
      'Python and FastAPI serving predictive models over a PostgreSQL store of historical lane data, with a React front end for the operations team working the exceptions queue.',
  },

  'project-5': {
    purpose:
      'An editorial-first storefront for a luxury house, where the browsing experience itself is the product and the catalogue is the supporting evidence.',
    problem:
      'Template commerce stores all look identical, and that sameness quietly destroys the signal a luxury brand spends its marketing budget establishing. Restraint and motion do the work that stock photography cannot.',
    features: [
      'Editorial hero framing each collection',
      'Animated product grid with staggered reveals',
      'Working cart with quick-add from the grid',
      'Motion design throughout the scroll experience',
      'Editorial typography and generous negative space',
      'Nuxt 3 rendering with Vue 3 composition',
    ],
    architecture:
      'Nuxt 3 with Vue 3 and Tailwind CSS. The visual language is mostly motion and restraint rather than heavy JavaScript, keeping the experience fast and the bundle small.',
  },

  'project-9': {
    purpose:
      'Institutional custody for digital assets that enforces an M-of-N signing policy and leaves an auditable record of every on-chain action.',
    problem:
      'A single-key wallet is a single point of compromise, but simply adding keys creates its own risk. Institutions need a policy — who can propose, who can approve, what is forbidden — and evidence that it was followed.',
    features: [
      'Multi-signature M-of-N policy enforcement',
      'Role-based proposal and approval separation',
      'Transaction simulation before signing',
      'Smart contract execution pipeline',
      'Complete audit log of proposals and signatures',
      'Cold key storage with hardware-backed signing',
    ],
    architecture:
      'Solidity contracts for the custody and policy logic with a Next.js front end and Ethers.js for signing workflows. Private keys never touch application code — signing is delegated to external signers.',
  },

  'project-11': {
    purpose:
      'A live streaming platform that transcodes at the edge, so a viewer joining from another continent still gets a sub-second glass-to-glass delay.',
    problem:
      'Centralised transcoding puts your servers in one region. Everyone else pays the latency, and you pay the bandwidth for every one of those long hops.',
    features: [
      'WebRTC ingest and low-latency egress',
      'Edge-distributed transcoding nodes',
      'Adaptive bitrate across the audience',
      'Simulcast to multiple transports at once',
      'Real-time viewer and QoE analytics',
      'FFmpeg pipeline for restream targets',
    ],
    architecture:
      'Node.js control plane coordinating a set of regional transcode nodes, with React for the studio and console UI. Each node handles its own audience, so load stays flat as viewership grows.',
  },

  'project-16': {
    purpose:
      'An automated valuation model for commercial real estate that returns a defensible number in minutes instead of after weeks of manual appraisal.',
    problem:
      'Commercial appraisal is slow and expensive, which means most deals are underwritten on stale comparable sales. The gap between an accurate price and a fast one is where margin quietly disappears.',
    features: [
      'Automated valuation model with confidence bands',
      'Geospatial and parcel-level data fusion',
      'Market sentiment signals from listings and transactions',
      'Land bank and assemblage analysis',
      'Comparable sales with adjustment reasoning',
      'AVM studio for manual override of model inputs',
    ],
    architecture:
      'Python and Django for the valuation service over PostGIS for spatial queries, paired with a Nuxt 3 front end. Geometry-heavy work happens in the database rather than in the browser.',
  },

  'project-21': {
    purpose:
      'A privileged communication channel between lawyers and their clients, where the messages and documents are unreadable to the firm, the vendors and anyone who later obtains the server.',
    problem:
      'Legal work runs over email and text. Privileged material then leaks through channels that were never designed to hold it, and file sharing happens through links that outlive the matter. A breach is a matter of routine rather than exception.',
    features: [
      'Signal Double Ratchet with X3DH prekey exchange',
      'Safety numbers to verify a contact has not been swapped',
      'End-to-end encrypted document vault with classification labels',
      'E-signature routing with reminder queues',
      'Court and statutory deadline tracking with alerts',
      'Access logging on every privileged document view',
      'Client-side key derivation — keys are never transmitted',
    ],
    architecture:
      'React Native clients talking a Signal-protocol-derived session over a Node.js relay that stores ciphertext only. Because the server is zero-knowledge, a compromise of the backend exposes no message content.',
  },

  'project-25': {
    purpose:
      'A spatial computing workspace where distributed engineering teams gather inside the same 3D CAD model to review designs together.',
    problem:
      'Screen-sharing a 3D model flattens it. Reviewers lose depth and spatial context, annotate flat screenshots, and design cycles stretch from hours into days of asynchronous comment threads.',
    features: [
      'WebXR immersive sessions in shared coordinate space',
      'Multi-user 3D annotation and markup',
      'Presence indicators showing who is in the model',
      'Version comparison between design revisions',
      'Session persistence so context survives a disconnect',
      'WebSocket sync at frame rate',
    ],
    architecture:
      'Three.js for the spatial scene with a Go WebSocket server brokering state between connected clients, so collaboration stays real-time without a heavyweight central simulation authority.',
  },
}
