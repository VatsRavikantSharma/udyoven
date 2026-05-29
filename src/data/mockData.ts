// B2B Factory-Vendor Quotation & Product Marketplace mock data.

export const company = {
  name: 'Udyoven Trade Pvt. Ltd.',
  tagline: 'B2B Factory & Vendor Marketplace',
  location: 'Mumbai, India',
};

export const roles = ['Factory Owner', 'Vendor', 'Admin'];

// ───────────── Dashboard KPIs ─────────────
export const factoryKpis = [
  { id: 'products',    label: 'Listed Products',      value: 48,   delta: '+4',   tone: 'primary' },
  { id: 'quotations',  label: 'Active Quotations',    value: 14,   delta: '+2',   tone: 'accent'  },
  { id: 'deals',       label: 'Pending Deals',        value: 6,    delta: '+1',   tone: 'warning' },
  { id: 'chats',       label: 'Open Chats',           value: 9,    delta: '+3',   tone: 'info'    },
];

export const vendorKpis = [
  { id: 'saved',       label: 'Saved Products',       value: 22,   delta: '+6',   tone: 'primary' },
  { id: 'quotations',  label: 'Requested Quotes',     value: 8,    delta: '+1',   tone: 'accent'  },
  { id: 'negotiations',label: 'Active Negotiations',  value: 3,    delta: '0',    tone: 'warning' },
  { id: 'deals',       label: 'Accepted Deals',       value: 5,    delta: '+2',   tone: 'info'    },
];

export const recentActivity = [
  { id: 'a1', text: 'New quotation request from Rajesh Textiles',  time: '10m', tone: 'info',    screen: 'Quotations' },
  { id: 'a2', text: 'Vendor GlobalMart accepted Quote Q-1041',     time: '25m', tone: 'success', screen: 'Quotations' },
  { id: 'a3', text: 'Product inquiry on "SS Pipe 2 inch"',          time: '1h',  tone: 'primary', screen: 'Products'   },
  { id: 'a4', text: 'Chat message from Patel Enterprises',         time: '2h',  tone: 'accent',  screen: 'Chat'       },
  { id: 'a5', text: 'Deal confirmed - Q-1038 closed successfully', time: '3h',  tone: 'success', screen: 'Quotations' },
];

// ───────────── Products ─────────────
export type Product = {
  id: string;
  name: string;
  category: string;
  factory: string;
  factoryCity: string;
  price: string;
  moq: number;
  moqUnit: string;
  rating: number;
  reviews: number;
  tags: string[];
  delivery: string;
  inStock: boolean;
  gst: string;
  hsn: string;
  description: string;
  specs: { key: string; value: string }[];
  variants: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: 'P001',
    name: 'SS Seamless Pipe 2 inch',
    category: 'Steel & Metals',
    factory: 'Tata Steel Pipes',
    factoryCity: 'Mumbai',
    price: 'Rs.320-Rs.480/meter',
    moq: 100,
    moqUnit: 'meters',
    rating: 4.7,
    reviews: 84,
    tags: ['Stainless Steel', 'Pipe', 'Grade 304'],
    delivery: '5-7 days',
    inStock: true,
    gst: '18%',
    hsn: '7304',
    description: 'Premium grade SS seamless pipes suitable for industrial, chemical, and food-grade applications. Available in multiple wall thicknesses.',
    specs: [
      { key: 'Grade', value: 'SS 304 / 316L' },
      { key: 'Outer Diameter', value: '2 inch (60.3 mm)' },
      { key: 'Wall Thickness', value: '2mm / 3mm / 4mm' },
      { key: 'Length', value: '6 meters standard' },
      { key: 'Finish', value: '2B / No.4 / Mirror' },
      { key: 'Certification', value: 'BIS / ASTM A312' },
    ],
    variants: ['2mm WT', '3mm WT', '4mm WT'],
    image: '',
  },
  {
    id: 'P002',
    name: 'CNC Machined Bracket',
    category: 'Machined Components',
    factory: 'PrecisionWorks Pune',
    factoryCity: 'Pune',
    price: 'Rs.180-Rs.240/piece',
    moq: 500,
    moqUnit: 'pieces',
    rating: 4.5,
    reviews: 42,
    tags: ['CNC', 'Aluminium', 'Custom'],
    delivery: '10-14 days',
    inStock: true,
    gst: '18%',
    hsn: '7616',
    description: 'High-tolerance CNC machined aluminium brackets. Custom drawings accepted. ISO 9001 certified facility.',
    specs: [
      { key: 'Material', value: 'Aluminium 6061-T6' },
      { key: 'Tolerance', value: '+/-0.05mm' },
      { key: 'Surface', value: 'Anodized / Powder Coated' },
      { key: 'Lead Time', value: '10-14 working days' },
      { key: 'Drawing Format', value: 'DWG, STEP, PDF' },
    ],
    variants: ['Standard', 'Heavy Duty', 'Custom'],
    image: '',
  },
  {
    id: 'P003',
    name: 'HDPE Water Tank 1000L',
    category: 'Plastics & Polymers',
    factory: 'Sintex-Pro Mfg.',
    factoryCity: 'Ahmedabad',
    price: 'Rs.4,200-Rs.4,800/unit',
    moq: 10,
    moqUnit: 'units',
    rating: 4.6,
    reviews: 120,
    tags: ['HDPE', 'Water Tank', 'BIS Certified'],
    delivery: '3-5 days',
    inStock: true,
    gst: '12%',
    hsn: '3925',
    description: 'Food-grade HDPE water storage tanks. UV stabilised, triple-layer construction. BIS certified.',
    specs: [
      { key: 'Capacity', value: '1000 Litres' },
      { key: 'Material', value: 'Virgin HDPE' },
      { key: 'Layers', value: 'Triple-layer' },
      { key: 'Colour', value: 'Black / Blue' },
      { key: 'Standard', value: 'IS 12701' },
    ],
    variants: ['500L', '1000L', '2000L', '5000L'],
    image: '',
  },
  {
    id: 'P004',
    name: 'Industrial Ball Valve 1 inch',
    category: 'Valves & Fittings',
    factory: 'FlowMaster Industries',
    factoryCity: 'Rajkot',
    price: 'Rs.180-Rs.320/piece',
    moq: 200,
    moqUnit: 'pieces',
    rating: 4.4,
    reviews: 67,
    tags: ['Ball Valve', 'SS', 'Full Bore'],
    delivery: '7-10 days',
    inStock: true,
    gst: '18%',
    hsn: '8481',
    description: 'Full bore SS ball valves for high-pressure industrial applications. Available in 2-piece and 3-piece configurations.',
    specs: [
      { key: 'Body Material', value: 'SS 316 / CF8M' },
      { key: 'End Connection', value: 'Threaded / Flanged' },
      { key: 'Pressure Rating', value: 'PN 40 (580 PSI)' },
      { key: 'Temperature', value: '-20C to +200C' },
    ],
    variants: ['3/4"', '1"', '1.5"', '2"', '3"'],
    image: '',
  },
  {
    id: 'P005',
    name: 'Cotton Yarn 30s Combed',
    category: 'Textiles & Fibres',
    factory: 'Rajesh Spinning Mills',
    factoryCity: 'Tiruppur',
    price: 'Rs.210-Rs.260/kg',
    moq: 500,
    moqUnit: 'kg',
    rating: 4.8,
    reviews: 210,
    tags: ['Cotton', 'Combed', 'Ring Spun'],
    delivery: '4-6 days',
    inStock: true,
    gst: '5%',
    hsn: '5205',
    description: 'Premium combed cotton yarn, ring spun. Suitable for knitting and weaving applications. Consistent quality with low count CV%.',
    specs: [
      { key: 'Count', value: '30s Ne' },
      { key: 'Type', value: 'Combed Ring Spun' },
      { key: 'TPI', value: '16.8' },
      { key: 'CV%', value: '<11%' },
      { key: 'Moisture', value: '7-8.5%' },
    ],
    variants: ['20s', '30s', '40s', '60s'],
    image: '',
  },
  {
    id: 'P006',
    name: 'Mild Steel HR Sheet 4mm',
    category: 'Steel & Metals',
    factory: 'JSW Steel Distributors',
    factoryCity: 'Mumbai',
    price: 'Rs.68-Rs.75/kg',
    moq: 1000,
    moqUnit: 'kg',
    rating: 4.5,
    reviews: 155,
    tags: ['MS', 'HR Sheet', 'IS 2062'],
    delivery: '2-4 days',
    inStock: true,
    gst: '18%',
    hsn: '7208',
    description: 'Hot rolled mild steel sheets conforming to IS 2062 Grade A. Standard coil/sheet form available.',
    specs: [
      { key: 'Grade', value: 'IS 2062 Grade A/B' },
      { key: 'Thickness', value: '4mm' },
      { key: 'Width', value: '1250mm / 1500mm' },
      { key: 'Length', value: '2500mm / Custom' },
    ],
    variants: ['2mm', '3mm', '4mm', '6mm', '8mm'],
    image: '',
  },
];

export const categories = [
  'All', 'Steel & Metals', 'Machined Components', 'Plastics & Polymers',
  'Valves & Fittings', 'Textiles & Fibres', 'Electrical & Electronics',
  'Chemicals', 'Packaging', 'Agricultural',
];

// ───────────── Quotations ─────────────
export type QuotationStatus =
  | 'Draft' | 'Sent' | 'Viewed' | 'Negotiating' | 'Revised'
  | 'Accepted' | 'Rejected' | 'Payment Pending' | 'Confirmed' | 'Closed';

export type QuotationItem = {
  product: string;
  qty: number;
  unit: string;
  rate: number;
  gst: number;
};

export type Quotation = {
  id: string;
  vendor: string;
  factory: string;
  amount: number;
  validity: string;
  status: QuotationStatus;
  items: QuotationItem[];
  rev: number;
  notes: string;
  paymentTerms: string;
  deliveryTerms: string;
  createdOn: string;
  lastUpdated: string;
};

export const quotations: Quotation[] = [
  {
    id: 'Q-1041',
    vendor: 'GlobalMart Traders',
    factory: 'Tata Steel Pipes',
    amount: 320000,
    validity: '10 Jun 2026',
    status: 'Negotiating',
    rev: 3,
    notes: 'Client requested 5% additional discount on bulk order.',
    paymentTerms: '50% advance, 50% before dispatch',
    deliveryTerms: 'Ex-Works, Mumbai',
    createdOn: '20 May 2026',
    lastUpdated: '27 May 2026',
    items: [
      { product: 'SS Seamless Pipe 2 inch (3mm WT)', qty: 500, unit: 'meters', rate: 420, gst: 18 },
      { product: 'SS Seamless Pipe 1 inch (2mm WT)', qty: 300, unit: 'meters', rate: 280, gst: 18 },
    ],
  },
  {
    id: 'Q-1042',
    vendor: 'Patel Enterprises',
    factory: 'PrecisionWorks Pune',
    amount: 176000,
    validity: '15 Jun 2026',
    status: 'Sent',
    rev: 1,
    notes: 'Custom bracket as per drawing PW-BR-2204.',
    paymentTerms: '100% advance',
    deliveryTerms: 'Door delivery included',
    createdOn: '24 May 2026',
    lastUpdated: '24 May 2026',
    items: [
      { product: 'CNC Machined Bracket (Heavy Duty)', qty: 800, unit: 'pcs', rate: 220, gst: 18 },
    ],
  },
  {
    id: 'Q-1043',
    vendor: 'Sunrise Constructions',
    factory: 'Sintex-Pro Mfg.',
    amount: 84000,
    validity: '01 Jul 2026',
    status: 'Draft',
    rev: 0,
    notes: '',
    paymentTerms: '30% advance, 70% on delivery',
    deliveryTerms: 'Delivered at site',
    createdOn: '27 May 2026',
    lastUpdated: '27 May 2026',
    items: [
      { product: 'HDPE Water Tank 1000L', qty: 20, unit: 'units', rate: 4200, gst: 12 },
    ],
  },
  {
    id: 'Q-1044',
    vendor: 'Metro Plumbing Co.',
    factory: 'FlowMaster Industries',
    amount: 96000,
    validity: '20 Jun 2026',
    status: 'Accepted',
    rev: 2,
    notes: 'Final terms agreed. Awaiting payment confirmation.',
    paymentTerms: '40% advance, 60% on delivery',
    deliveryTerms: 'Ex-Works, Rajkot',
    createdOn: '15 May 2026',
    lastUpdated: '26 May 2026',
    items: [
      { product: 'Industrial Ball Valve 1 inch SS316', qty: 400, unit: 'pcs', rate: 240, gst: 18 },
    ],
  },
  {
    id: 'Q-1045',
    vendor: 'Kurva Garments',
    factory: 'Rajesh Spinning Mills',
    amount: 420000,
    validity: '05 Jul 2026',
    status: 'Confirmed',
    rev: 1,
    notes: 'Deal confirmed. Delivery scheduled 3 Jun 2026.',
    paymentTerms: '25% advance, 75% on delivery',
    deliveryTerms: 'Delivered, Tiruppur',
    createdOn: '10 May 2026',
    lastUpdated: '25 May 2026',
    items: [
      { product: 'Cotton Yarn 30s Combed', qty: 2000, unit: 'kg', rate: 210, gst: 5 },
    ],
  },
  {
    id: 'Q-1046',
    vendor: 'BuildRight Infra',
    factory: 'JSW Steel Distributors',
    amount: 612000,
    validity: '25 Jun 2026',
    status: 'Rejected',
    rev: 2,
    notes: 'Client found alternative supplier at lower rate.',
    paymentTerms: '30% advance',
    deliveryTerms: 'Ex-Works, Mumbai',
    createdOn: '05 May 2026',
    lastUpdated: '22 May 2026',
    items: [
      { product: 'Mild Steel HR Sheet 4mm', qty: 9000, unit: 'kg', rate: 68, gst: 18 },
    ],
  },
];

export const quotationStatuses: QuotationStatus[] = [
  'Draft', 'Sent', 'Viewed', 'Negotiating', 'Revised',
  'Accepted', 'Rejected', 'Payment Pending', 'Confirmed', 'Closed',
];

export const quotationTimeline = [
  { step: 'Quotation Requested',  done: true,  date: '20 May 2026' },
  { step: 'Factory Created Quote',done: true,  date: '21 May 2026' },
  { step: 'Sent to Vendor',       done: true,  date: '21 May 2026' },
  { step: 'Viewed by Vendor',     done: true,  date: '22 May 2026' },
  { step: 'Negotiation Started',  done: true,  date: '24 May 2026', current: true },
  { step: 'Revised Quote Sent',   done: false, date: '---' },
  { step: 'Vendor Accepts',       done: false, date: '---' },
  { step: 'Deal Confirmation',    done: false, date: '---' },
  { step: 'Payment Readiness',    done: false, date: '---' },
  { step: 'Deal Closed',          done: false, date: '---' },
];

// ───────────── Chat ─────────────
export type ChatThread = {
  id: string;
  contact: string;
  contactRole: string;
  productRef: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

export const chatThreads: ChatThread[] = [
  { id: 'C01', contact: 'Rajesh Kumar',    contactRole: 'Vendor',         productRef: 'SS Pipe 2"',            lastMessage: 'Can you match Rs.400/m for 500m?',        time: '10:42 AM', unread: 2, online: true  },
  { id: 'C02', contact: 'Priya Mehta',     contactRole: 'Factory Owner',  productRef: 'CNC Bracket',           lastMessage: 'Drawing uploaded. Check attachment.',   time: '09:18 AM', unread: 1, online: false },
  { id: 'C03', contact: 'Amit Singh',      contactRole: 'Vendor',         productRef: 'HDPE Tank 1000L',       lastMessage: 'Confirmed - place the order.',          time: 'Yesterday', unread: 0, online: true  },
  { id: 'C04', contact: 'Sunita Patel',    contactRole: 'Vendor',         productRef: 'Ball Valve 1"',         lastMessage: 'Need 500 pcs delivery by 10 Jun.',      time: 'Yesterday', unread: 0, online: false },
  { id: 'C05', contact: 'Vikram Joshi',    contactRole: 'Factory Owner',  productRef: 'Cotton Yarn 30s',       lastMessage: 'Revised rate: Rs.215/kg for 2000kg.',     time: '26 May',    unread: 0, online: false },
  { id: 'C06', contact: 'Neha Sharma',     contactRole: 'Vendor',         productRef: 'MS HR Sheet 4mm',       lastMessage: 'Can you provide IS 2062 certificate?',  time: '25 May',    unread: 0, online: true  },
];

export type ChatMessage = {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  type: 'text' | 'attachment' | 'quotation';
  attachmentName?: string;
  read: boolean;
};

export const chatMessages: ChatMessage[] = [
  { id: 'm1', sender: 'them', text: 'Hi, I am interested in SS Pipe 2 inch Grade 304. What is the price for 500m?', time: '10:10 AM', type: 'text', read: true },
  { id: 'm2', sender: 'me',   text: 'Hello! For 500m the price is Rs.420/m for 3mm wall thickness. MOQ is 100m.', time: '10:15 AM', type: 'text', read: true },
  { id: 'm3', sender: 'them', text: 'Can you do Rs.400/m? We need consistent quality and can commit to 500m this order.', time: '10:22 AM', type: 'text', read: true },
  { id: 'm4', sender: 'me',   text: 'Let me check. We can offer Rs.410/m if you can pay 50% advance.', time: '10:28 AM', type: 'text', read: true },
  { id: 'm5', sender: 'me',   text: 'Product Catalog', time: '10:29 AM', type: 'attachment', attachmentName: 'SS-Pipe-Catalog-2026.pdf', read: true },
  { id: 'm6', sender: 'them', text: 'Quotation Request - Q-1041', time: '10:35 AM', type: 'quotation', read: true },
  { id: 'm7', sender: 'them', text: 'Can you match Rs.400/m for 500m?', time: '10:42 AM', type: 'text', read: false },
];

// ───────────── Notifications ─────────────
export type AppNotification = {
  id: string;
  type: 'quotation' | 'chat' | 'deal' | 'inquiry' | 'product' | 'payment';
  title: string;
  body: string;
  time: string;
  read: boolean;
  screen: string;
};

export const notifications: AppNotification[] = [
  { id: 'n1', type: 'quotation', title: 'New Quotation Request',         body: 'GlobalMart Traders requested quote on SS Pipe 2".',           time: '10m',  read: false, screen: 'Quotations' },
  { id: 'n2', type: 'chat',      title: 'New Chat Message',              body: 'Rajesh Kumar: "Can you match Rs.400/m for 500m?"',             time: '12m',  read: false, screen: 'Chat'       },
  { id: 'n3', type: 'deal',      title: 'Deal Confirmed - Q-1045',       body: 'Kurva Garments confirmed deal for Cotton Yarn 30s.',         time: '1h',   read: false, screen: 'Quotations' },
  { id: 'n4', type: 'quotation', title: 'Quotation Accepted',            body: 'Metro Plumbing Co. accepted Q-1044 - Ball Valve order.',    time: '2h',   read: true,  screen: 'Quotations' },
  { id: 'n5', type: 'inquiry',   title: 'Product Inquiry Received',      body: 'Neha Sharma enquired about MS HR Sheet 4mm.',               time: '3h',   read: true,  screen: 'Products'   },
  { id: 'n6', type: 'quotation', title: 'Quotation Under Negotiation',   body: 'Q-1041 - Vendor requested further revision.',               time: '4h',   read: true,  screen: 'Quotations' },
  { id: 'n7', type: 'payment',   title: 'Payment Readiness Confirmation',body: 'Metro Plumbing Co. confirmed payment readiness for Q-1044.', time: '5h',   read: true,  screen: 'Quotations' },
  { id: 'n8', type: 'product',   title: 'Product Listing Updated',       body: 'Your product "HDPE Tank 1000L" is now live.',               time: '1d',   read: true,  screen: 'Products'   },
];

// ───────────── Vendors ─────────────
export const vendors = [
  { id: 'V01', name: 'GlobalMart Traders',     city: 'Delhi',      category: 'Steel & Metals',         rating: 4.5, activeQuotes: 3, status: 'Active',   item: 'SS Pipe 2"',        payment: 'Net-30', reliability: 92, leadTime: 7, pendingOrders: 3 },
  { id: 'V02', name: 'Patel Enterprises',      city: 'Surat',      category: 'Machined Components',    rating: 4.7, activeQuotes: 1, status: 'Active',   item: 'CNC Bracket',       payment: 'Advance', reliability: 96, leadTime: 14, pendingOrders: 1 },
  { id: 'V03', name: 'Sunrise Constructions',  city: 'Bangalore',  category: 'Plastics & Polymers',    rating: 4.2, activeQuotes: 1, status: 'Active',   item: 'HDPE Tank 1000L',   payment: 'Net-15', reliability: 87, leadTime: 5, pendingOrders: 1 },
  { id: 'V04', name: 'Metro Plumbing Co.',     city: 'Chennai',    category: 'Valves & Fittings',      rating: 4.6, activeQuotes: 2, status: 'Active',   item: 'Ball Valve 1"',     payment: 'Net-30', reliability: 94, leadTime: 10, pendingOrders: 2 },
  { id: 'V05', name: 'Kurva Garments',         city: 'Tiruppur',   category: 'Textiles & Fibres',      rating: 4.8, activeQuotes: 0, status: 'Active',   item: 'Cotton Yarn 30s',   payment: 'Net-60', reliability: 98, leadTime: 6, pendingOrders: 0 },
  { id: 'V06', name: 'BuildRight Infra',       city: 'Hyderabad',  category: 'Steel & Metals',         rating: 3.9, activeQuotes: 0, status: 'Inactive', item: 'MS HR Sheet 4mm',   payment: 'Advance', reliability: 76, leadTime: 4, pendingOrders: 0 },
];

// ───────────── Deal Tracking ─────────────
export type DealPhase =
  | 'Initial Inquiry'
  | 'Quotation Discussion'
  | 'Price Negotiation'
  | 'Terms Negotiation'
  | 'Final Approval'
  | 'Payment Readiness'
  | 'Deal Confirmation'
  | 'Order Processing';

export type DealStatus = 'Active' | 'Negotiating' | 'Payment Pending' | 'Confirmed' | 'Closed' | 'Cancelled';

export type QuoteVersion = {
  version: number;
  amount: number;
  date: string;
  changedBy: 'Factory' | 'Vendor';
  changes: string;
};

export type NegotiationEntry = {
  id: string;
  phase: DealPhase;
  actor: 'Factory' | 'Vendor' | 'System';
  actorName: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'message' | 'quote_change' | 'approval' | 'rejection' | 'payment' | 'phase_change';
};

export type Deal = {
  id: string;
  quotationId: string;
  vendor: string;
  vendorCity: string;
  factory: string;
  product: string;
  qty: number;
  unit: string;
  finalAmount: number;
  currentPhase: DealPhase;
  phaseIndex: number;
  status: DealStatus;
  paymentReady: boolean;
  deliveryReady: boolean;
  createdOn: string;
  lastUpdated: string;
  deliveryDate: string;
  notes: string;
  timeline: NegotiationEntry[];
  quoteVersions: QuoteVersion[];
};

export const DEAL_PHASES: DealPhase[] = [
  'Initial Inquiry',
  'Quotation Discussion',
  'Price Negotiation',
  'Terms Negotiation',
  'Final Approval',
  'Payment Readiness',
  'Deal Confirmation',
  'Order Processing',
];

export const deals: Deal[] = [
  {
    id: 'D-2041',
    quotationId: 'Q-1041',
    vendor: 'GlobalMart Traders',
    vendorCity: 'Delhi',
    factory: 'Tata Steel Pipes',
    product: 'SS Seamless Pipe 2 inch',
    qty: 500,
    unit: 'meters',
    finalAmount: 320000,
    currentPhase: 'Price Negotiation',
    phaseIndex: 2,
    status: 'Negotiating',
    paymentReady: false,
    deliveryReady: false,
    createdOn: '20 May 2026',
    lastUpdated: '27 May 2026',
    deliveryDate: '15 Jun 2026',
    notes: 'Client wants 5% extra discount on 500m bulk. Counter offered at Rs.410/m.',
    quoteVersions: [
      { version: 1, amount: 336000, date: '20 May 2026', changedBy: 'Factory', changes: 'Initial quote Rs.420/m × 500m + 300m × Rs.280/m' },
      { version: 2, amount: 325000, date: '24 May 2026', changedBy: 'Factory', changes: 'Revised to Rs.415/m on 500m portion' },
      { version: 3, amount: 320000, date: '27 May 2026', changedBy: 'Factory', changes: 'Final offer Rs.410/m, 50% advance condition' },
    ],
    timeline: [
      { id: 't1', phase: 'Initial Inquiry',      actor: 'Vendor',   actorName: 'Rajesh Kumar',   action: 'Sent product inquiry',      detail: 'Interested in SS Pipe 2" Grade 304 — 500m + 300m',            timestamp: '20 May 10:10',  type: 'message'      },
      { id: 't2', phase: 'Quotation Discussion', actor: 'Factory',  actorName: 'Tata Steel',      action: 'Created quotation Q-1041',  detail: 'Sent V1 quote Rs.420/m for 500m, Rs.280/m for 300m',         timestamp: '21 May 09:00',  type: 'quote_change' },
      { id: 't3', phase: 'Quotation Discussion', actor: 'Vendor',   actorName: 'Rajesh Kumar',   action: 'Viewed quotation',          detail: 'Vendor opened Q-1041',                                       timestamp: '22 May 11:15',  type: 'phase_change' },
      { id: 't4', phase: 'Price Negotiation',    actor: 'Vendor',   actorName: 'Rajesh Kumar',   action: 'Counter offer submitted',   detail: 'Requested Rs.400/m for 500m citing bulk commitment',          timestamp: '24 May 14:30',  type: 'message'      },
      { id: 't5', phase: 'Price Negotiation',    actor: 'Factory',  actorName: 'Tata Steel',      action: 'Revised quote sent V2',     detail: 'Revised to Rs.415/m for 500m — sent Q-1041 Rev 2',           timestamp: '24 May 16:00',  type: 'quote_change' },
      { id: 't6', phase: 'Price Negotiation',    actor: 'Vendor',   actorName: 'Rajesh Kumar',   action: 'Counter offer — Rs.405/m',  detail: 'Willing to pay 50% advance for Rs.405/m',                    timestamp: '26 May 10:00',  type: 'message'      },
      { id: 't7', phase: 'Price Negotiation',    actor: 'Factory',  actorName: 'Tata Steel',      action: 'Final offer V3 — Rs.410/m', detail: 'Final price Rs.410/m with 50% advance. Non-negotiable.',     timestamp: '27 May 09:30',  type: 'quote_change' },
    ],
  },
  {
    id: 'D-2044',
    quotationId: 'Q-1044',
    vendor: 'Metro Plumbing Co.',
    vendorCity: 'Chennai',
    factory: 'FlowMaster Industries',
    product: 'Industrial Ball Valve 1 inch SS316',
    qty: 400,
    unit: 'pcs',
    finalAmount: 96000,
    currentPhase: 'Payment Readiness',
    phaseIndex: 5,
    status: 'Payment Pending',
    paymentReady: false,
    deliveryReady: true,
    createdOn: '15 May 2026',
    lastUpdated: '26 May 2026',
    deliveryDate: '05 Jun 2026',
    notes: 'All terms agreed. Waiting for 40% advance payment confirmation.',
    quoteVersions: [
      { version: 1, amount: 112000, date: '15 May 2026', changedBy: 'Factory', changes: 'Initial quote Rs.280/pc × 400' },
      { version: 2, amount: 96000,  date: '20 May 2026', changedBy: 'Factory', changes: 'Revised to Rs.240/pc bulk discount — accepted by vendor' },
    ],
    timeline: [
      { id: 't1', phase: 'Initial Inquiry',      actor: 'Vendor',  actorName: 'Sunita Patel',  action: 'Sent inquiry',              detail: '400 pcs SS316 Ball Valve 1 inch needed',                      timestamp: '15 May 10:00', type: 'message'      },
      { id: 't2', phase: 'Quotation Discussion', actor: 'Factory', actorName: 'FlowMaster',    action: 'Quote V1 sent',             detail: 'Rs.280/pc × 400 = Rs.1,12,000',                              timestamp: '15 May 14:00', type: 'quote_change' },
      { id: 't3', phase: 'Price Negotiation',    actor: 'Vendor',  actorName: 'Sunita Patel',  action: 'Counter offer',             detail: 'Rs.220/pc for 400 pcs with advance payment',                 timestamp: '18 May 11:00', type: 'message'      },
      { id: 't4', phase: 'Price Negotiation',    actor: 'Factory', actorName: 'FlowMaster',    action: 'Revised V2 — Rs.240/pc',    detail: 'Best offer Rs.240/pc. 40% advance, 60% on dispatch.',         timestamp: '20 May 09:00', type: 'quote_change' },
      { id: 't5', phase: 'Terms Negotiation',    actor: 'Vendor',  actorName: 'Sunita Patel',  action: 'Accepted pricing',          detail: 'Rs.240/pc accepted. Requested 7-day delivery.',              timestamp: '22 May 15:00', type: 'approval'     },
      { id: 't6', phase: 'Final Approval',       actor: 'Factory', actorName: 'FlowMaster',    action: 'Terms confirmed',           detail: 'Delivery 5 Jun 2026. 40% advance, 60% on dispatch confirmed.',timestamp: '24 May 11:00', type: 'approval'     },
      { id: 't7', phase: 'Payment Readiness',    actor: 'System',  actorName: 'System',         action: 'Awaiting advance payment',  detail: 'Payment of Rs.38,400 (40%) pending from Metro Plumbing.',    timestamp: '26 May 08:00', type: 'payment'      },
    ],
  },
  {
    id: 'D-2045',
    quotationId: 'Q-1045',
    vendor: 'Kurva Garments',
    vendorCity: 'Tiruppur',
    factory: 'Rajesh Spinning Mills',
    product: 'Cotton Yarn 30s Combed',
    qty: 2000,
    unit: 'kg',
    finalAmount: 420000,
    currentPhase: 'Order Processing',
    phaseIndex: 7,
    status: 'Confirmed',
    paymentReady: true,
    deliveryReady: true,
    createdOn: '10 May 2026',
    lastUpdated: '25 May 2026',
    deliveryDate: '03 Jun 2026',
    notes: 'Deal fully confirmed. Advance paid. Dispatch on 01 Jun 2026.',
    quoteVersions: [
      { version: 1, amount: 440000, date: '10 May 2026', changedBy: 'Factory', changes: 'Initial Rs.220/kg × 2000kg' },
      { version: 2, amount: 420000, date: '18 May 2026', changedBy: 'Factory', changes: 'Final Rs.210/kg agreed upon 25% advance' },
    ],
    timeline: [
      { id: 't1', phase: 'Initial Inquiry',      actor: 'Vendor',  actorName: 'Kurva Garments',  action: 'Bulk inquiry submitted',    detail: '2000 kg Cotton Yarn 30s Combed required monthly',            timestamp: '10 May 09:00', type: 'message'      },
      { id: 't2', phase: 'Quotation Discussion', actor: 'Factory', actorName: 'Rajesh Spinning', action: 'Quote V1 — Rs.220/kg',      detail: 'Q-1045 V1: Rs.220/kg × 2000kg = Rs.4,40,000',               timestamp: '10 May 14:00', type: 'quote_change' },
      { id: 't3', phase: 'Price Negotiation',    actor: 'Vendor',  actorName: 'Kurva Garments',  action: 'Counter offer — Rs.200/kg', detail: 'Requesting Rs.200/kg for consistent monthly orders',         timestamp: '14 May 10:00', type: 'message'      },
      { id: 't4', phase: 'Price Negotiation',    actor: 'Factory', actorName: 'Rajesh Spinning', action: 'Revised V2 — Rs.210/kg',    detail: 'Rs.210/kg final — 25% advance needed',                       timestamp: '18 May 11:00', type: 'quote_change' },
      { id: 't5', phase: 'Terms Negotiation',    actor: 'Vendor',  actorName: 'Kurva Garments',  action: 'Terms accepted',            detail: 'Rs.210/kg, 25% advance, delivery 3 Jun',                    timestamp: '20 May 09:00', type: 'approval'     },
      { id: 't6', phase: 'Final Approval',       actor: 'Factory', actorName: 'Rajesh Spinning', action: 'Final approval given',      detail: 'Both parties agreed on all terms',                          timestamp: '22 May 10:00', type: 'approval'     },
      { id: 't7', phase: 'Payment Readiness',    actor: 'Vendor',  actorName: 'Kurva Garments',  action: 'Advance payment confirmed', detail: 'Rs.1,05,000 (25%) advance payment received',                 timestamp: '24 May 12:00', type: 'payment'      },
      { id: 't8', phase: 'Deal Confirmation',    actor: 'System',  actorName: 'System',           action: 'Deal officially confirmed', detail: 'D-2045 confirmed. Order placed with factory.',               timestamp: '25 May 09:00', type: 'phase_change' },
    ],
  },
  {
    id: 'D-2046',
    quotationId: 'Q-1046',
    vendor: 'BuildRight Infra',
    vendorCity: 'Hyderabad',
    factory: 'JSW Steel Distributors',
    product: 'Mild Steel HR Sheet 4mm',
    qty: 9000,
    unit: 'kg',
    finalAmount: 612000,
    currentPhase: 'Initial Inquiry',
    phaseIndex: 0,
    status: 'Cancelled',
    paymentReady: false,
    deliveryReady: false,
    createdOn: '05 May 2026',
    lastUpdated: '22 May 2026',
    deliveryDate: '---',
    notes: 'Vendor found alternate supplier at Rs.62/kg. Deal cancelled.',
    quoteVersions: [
      { version: 1, amount: 680400, date: '05 May 2026', changedBy: 'Factory', changes: 'Initial Rs.68/kg × 9000kg + 18% GST' },
      { version: 2, amount: 612000, date: '15 May 2026', changedBy: 'Factory', changes: 'Revised Rs.68/kg — GST adjusted' },
    ],
    timeline: [
      { id: 't1', phase: 'Initial Inquiry',      actor: 'Vendor',  actorName: 'BuildRight Infra', action: 'Inquiry submitted',         detail: '9000 kg MS HR Sheet 4mm, IS 2062 Grade A',                  timestamp: '05 May 10:00', type: 'message'      },
      { id: 't2', phase: 'Quotation Discussion', actor: 'Factory', actorName: 'JSW Steel',         action: 'Quote V1 sent',             detail: 'Rs.68/kg × 9000 = Rs.6,12,000 ex-GST',                      timestamp: '05 May 16:00', type: 'quote_change' },
      { id: 't3', phase: 'Price Negotiation',    actor: 'Vendor',  actorName: 'BuildRight Infra', action: 'Counter Rs.60/kg',          detail: 'Requesting Rs.60/kg to match competitor quote',             timestamp: '10 May 11:00', type: 'message'      },
      { id: 't4', phase: 'Price Negotiation',    actor: 'Factory', actorName: 'JSW Steel',         action: 'Declined counter offer',    detail: 'Cannot go below Rs.67/kg on IS 2062 Grade A',               timestamp: '12 May 09:00', type: 'rejection'    },
      { id: 't5', phase: 'Initial Inquiry',      actor: 'Vendor',  actorName: 'BuildRight Infra', action: 'Deal cancelled',            detail: 'Vendor found alternate supplier at Rs.62/kg',               timestamp: '22 May 14:00', type: 'rejection'    },
    ],
  },
];
