// Realistic sample manufacturing data for the FactoryOps ERP app.

export const company = {
  name: 'Udyoven Industries Pvt. Ltd.',
  unit: 'Plant 1 — Pune',
  units: ['Plant 1 — Pune', 'Plant 2 — Coimbatore', 'Plant 3 — Surat'],
  shift: 'Shift A · 08:00 – 16:00',
};

export const kpis = [
  { id: 'orders',    label: "Today's Orders",     value: 42,  delta: '+8%',  tone: 'info'    },
  { id: 'jobs',      label: 'Active Production',   value: 17,  delta: '+3',   tone: 'primary' },
  { id: 'lowStock',  label: 'Low Stock Items',     value: 9,   delta: '+2',   tone: 'warning' },
  { id: 'quotes',    label: 'Pending Quotations',  value: 12,  delta: '−1',   tone: 'accent'  },
  { id: 'dispatch',  label: 'Dispatch Due Today',  value: 6,   delta: '!',    tone: 'orange'  },
  { id: 'payments',  label: 'Payment Pending',     value: '₹18.4L', delta: '+₹2.1L', tone: 'danger' },
  { id: 'qc',        label: 'QC Hold Items',       value: 4,   delta: '+1',   tone: 'warning' },
  { id: 'machines',  label: 'Machine Alerts',      value: 3,   delta: '!',    tone: 'orange'  },
];

export const liveStatus = [
  { id: 'eff',  label: 'Production Efficiency', value: 86, suffix: '%', tone: 'primary' },
  { id: 'ful',  label: 'Order Fulfillment',     value: 92, suffix: '%', tone: 'accent'  },
  { id: 'dis',  label: 'Dispatch Readiness',    value: 74, suffix: '%', tone: 'info'    },
  { id: 'inv',  label: 'Inventory Health',      value: 81, suffix: '%', tone: 'warning' },
  { id: 'plt',  label: 'Plant Utilization',     value: 78, suffix: '%', tone: 'primary' },
  { id: 'upt',  label: 'Machine Uptime',        value: 96, suffix: '%', tone: 'accent'  },
];

export const weeklyProduction = [62, 71, 68, 84, 79, 88, 92];
export const rawMaterialTrend = [40, 55, 48, 60, 52, 65, 58];
export const dispatchTrend    = [18, 24, 22, 30, 28, 34, 31];
export const collectionTrend  = [12, 18, 14, 22, 19, 26, 24]; // ₹ Lakh

export const quickActions = [
  { id: 'quote',    label: 'Create Quote',        icon: '📄', screen: 'QuotationCreate' },
  { id: 'batch',    label: 'Start Batch',         icon: '⚙️', screen: 'ProductionPlan' },
  { id: 'pr',       label: 'Purchase Request',    icon: '🛒', screen: 'Procurement' },
  { id: 'stock',    label: 'Add Stock Entry',     icon: '📦', screen: 'Inventory' },
  { id: 'qc',       label: 'QC Inspection',       icon: '🔬', screen: 'QC' },
  { id: 'ship',     label: 'Schedule Dispatch',   icon: '🚚', screen: 'Dispatch' },
  { id: 'inv',      label: 'Generate Invoice',    icon: '🧾', screen: 'Invoices' },
  { id: 'rep',      label: 'View Reports',        icon: '📊', screen: 'Reports' },
];

export const smartAlerts = [
  { id: 'a1', tone: 'warning', text: 'Steel Coil 4mm stock below reorder level (210kg / 500kg)', screen: 'Inventory' },
  { id: 'a2', tone: 'danger',  text: 'CNC Machine #3 overheating — temp 86°C', screen: 'Machines' },
  { id: 'a3', tone: 'orange',  text: 'Dispatch for Order #A102 delayed by 1 day',       screen: 'Dispatch' },
  { id: 'a4', tone: 'warning', text: 'QC rejection on Batch #B17 — 6.2% rate',          screen: 'QC' },
  { id: 'a5', tone: 'danger',  text: 'Payment from Tata Forge overdue by 12 days',      screen: 'Invoices' },
];

export const aiInsights = [
  { id: 'i1', tag: 'OPTIMIZE',  text: 'Production can be improved by 8% by rescheduling Line 2 to night shift.' },
  { id: 'i2', tag: 'STOCK',     text: 'Raw material “Brass Rod 12mm” likely to go out of stock in 3 days.' },
  { id: 'i3', tag: 'DISPATCH',  text: '2 orders may miss dispatch deadline if not packed today.' },
  { id: 'i4', tag: 'QUALITY',   text: 'Batch #B19 shows 1.4σ deviation — recommend manual QC.' },
];

// ───────────── Orders ─────────────
export type Order = {
  id: string;
  client: string;
  product: string;
  qty: number;
  unit: string;
  rate: number;
  committed: string;
  payment: 'Paid' | 'Partial' | 'Pending';
  dispatch: 'Pending' | 'Scheduled' | 'In Transit' | 'Delivered';
  status:
    | 'New Inquiry'
    | 'Confirmed'
    | 'In Production'
    | 'Ready to Dispatch'
    | 'Completed'
    | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  unitAssigned: string;
  ageDays: number;
  delayRisk: boolean;
};

export const orders: Order[] = [
  { id: 'A102', client: 'Tata Forge Ltd.',     product: 'CNC Bracket 220mm',  qty: 1200, unit: 'pcs', rate: 184, committed: '24 Apr', payment: 'Partial', dispatch: 'Scheduled', status: 'In Production', priority: 'High',   unitAssigned: 'Plant 1 — Pune',     ageDays: 6, delayRisk: true  },
  { id: 'A103', client: 'Mahindra Auto',       product: 'Gearbox Housing',    qty: 480,  unit: 'pcs', rate: 920, committed: '26 Apr', payment: 'Pending', dispatch: 'Pending',   status: 'Confirmed',     priority: 'Medium', unitAssigned: 'Plant 2 — Coimbatore', ageDays: 3, delayRisk: false },
  { id: 'A104', client: 'L&T Heavy',           product: 'Hydraulic Cylinder', qty: 60,   unit: 'pcs', rate: 12400, committed: '02 May', payment: 'Paid',   dispatch: 'Pending',   status: 'New Inquiry',   priority: 'High',   unitAssigned: 'Plant 1 — Pune',     ageDays: 1, delayRisk: false },
  { id: 'A105', client: 'Bajaj Industries',    product: 'Sheet Metal Cover',  qty: 5000, unit: 'pcs', rate: 42,  committed: '23 Apr', payment: 'Partial', dispatch: 'In Transit',status: 'Ready to Dispatch', priority: 'High', unitAssigned: 'Plant 3 — Surat',  ageDays: 9, delayRisk: false },
  { id: 'A106', client: 'Ashok Leyland',       product: 'Brake Drum Casting', qty: 220,  unit: 'pcs', rate: 1750, committed: '28 Apr', payment: 'Pending', dispatch: 'Pending',   status: 'In Production', priority: 'Medium', unitAssigned: 'Plant 2 — Coimbatore', ageDays: 4, delayRisk: true  },
  { id: 'A107', client: 'JSW Steel',           product: 'Coil Slitting',      qty: 18,   unit: 'tons', rate: 64000, committed: '20 Apr', payment: 'Paid',   dispatch: 'Delivered', status: 'Completed',     priority: 'Low',    unitAssigned: 'Plant 3 — Surat',  ageDays: 14, delayRisk: false },
  { id: 'A108', client: 'Hero MotoCorp',       product: 'Sprocket 38T',       qty: 800,  unit: 'pcs', rate: 220, committed: '01 May', payment: 'Pending', dispatch: 'Pending',   status: 'New Inquiry',   priority: 'Low',    unitAssigned: 'Plant 1 — Pune',     ageDays: 0, delayRisk: false },
  { id: 'A109', client: 'Kirloskar Bros.',     product: 'Pump Impeller',      qty: 150,  unit: 'pcs', rate: 1850, committed: '19 Apr', payment: 'Paid',   dispatch: 'Pending',   status: 'Cancelled',     priority: 'Medium', unitAssigned: 'Plant 2 — Coimbatore', ageDays: 11, delayRisk: false },
];

export const orderTimeline = [
  { step: 'Inquiry Received',   date: '14 Apr',  done: true },
  { step: 'Quote Sent',         date: '15 Apr',  done: true },
  { step: 'Order Confirmed',    date: '16 Apr',  done: true },
  { step: 'Production Planned', date: '17 Apr',  done: true },
  { step: 'Production Started', date: '18 Apr',  done: true },
  { step: 'QC Checked',         date: '22 Apr',  done: false, current: true },
  { step: 'Packed',             date: '—',       done: false },
  { step: 'Dispatch Scheduled', date: '24 Apr',  done: false },
  { step: 'Delivered',          date: '—',       done: false },
];

// ───────────── Quotations ─────────────
export const quotations = [
  { id: 'Q-2041', client: 'Tata Forge Ltd.',  amount: 248400, validity: '28 Apr', status: 'Sent',         margin: 18, items: 4, rev: 1 },
  { id: 'Q-2042', client: 'Mahindra Auto',    amount: 442000, validity: '02 May', status: 'Negotiation',  margin: 12, items: 2, rev: 3 },
  { id: 'Q-2043', client: 'L&T Heavy',        amount: 744000, validity: '06 May', status: 'Draft',        margin: 22, items: 1, rev: 0 },
  { id: 'Q-2044', client: 'Bajaj Industries', amount: 210000, validity: '24 Apr', status: 'Approved',     margin: 16, items: 5, rev: 1 },
  { id: 'Q-2045', client: 'Hero MotoCorp',    amount: 176000, validity: '12 Apr', status: 'Expired',      margin: 9,  items: 2, rev: 2 },
  { id: 'Q-2046', client: 'Kirloskar Bros.',  amount: 277500, validity: '19 Apr', status: 'Rejected',     margin: 11, items: 3, rev: 2 },
];

// ───────────── Production ─────────────
export const productionJobs = [
  { id: 'B17', order: 'A102', item: 'CNC Bracket 220mm',  qty: 1200, machine: 'CNC-03', line: 'Line A', shift: 'A', supervisor: 'R. Kulkarni', readiness: 'Material OK',     status: 'Running',    progress: 64, target: 1200, output: 768, rejects: 12, eff: 88 },
  { id: 'B18', order: 'A103', item: 'Gearbox Housing',    qty: 480,  machine: 'VMC-01', line: 'Line B', shift: 'A', supervisor: 'S. Iyer',     readiness: 'Material OK',     status: 'Running',    progress: 32, target: 480,  output: 154, rejects: 3,  eff: 81 },
  { id: 'B19', order: 'A106', item: 'Brake Drum Casting', qty: 220,  machine: 'FUR-02', line: 'Line C', shift: 'B', supervisor: 'A. Nair',     readiness: 'Awaiting Sand',    status: 'Hold',       progress: 12, target: 220,  output: 26,  rejects: 4,  eff: 62 },
  { id: 'B20', order: 'A105', item: 'Sheet Metal Cover',  qty: 5000, machine: 'PRS-04', line: 'Line A', shift: 'A', supervisor: 'R. Kulkarni', readiness: 'Material OK',     status: 'QC Wait',    progress: 100,target: 5000, output: 5000,rejects: 84, eff: 94 },
  { id: 'B21', order: 'A104', item: 'Hydraulic Cylinder', qty: 60,   machine: 'LAT-02', line: 'Line D', shift: 'A', supervisor: 'V. Desai',    readiness: 'Material Pending', status: 'Idle',       progress: 0,  target: 60,   output: 0,   rejects: 0,  eff: 0  },
  { id: 'B22', order: 'A108', item: 'Sprocket 38T',       qty: 800,  machine: 'CNC-05', line: 'Line B', shift: 'B', supervisor: 'S. Iyer',     readiness: 'Material OK',     status: 'Maintenance',progress: 8,  target: 800,  output: 64,  rejects: 1,  eff: 70 },
];

export const productionSummary = {
  activeLines: 4,
  runningJobs: 6,
  delayedJobs: 2,
  output: 6012,
  rejection: 1.7,
  utilization: 78,
};

// ───────────── Inventory ─────────────
export type Stock = {
  id: string;
  sku: string;
  name: string;
  category: 'Raw Material' | 'Finished Goods' | 'Packaging' | 'WIP' | 'Spare Parts';
  unit: string;
  qty: number;
  reorder: number;
  reserved: number;
  warehouse: string;
  movement: string;
  health: 'OK' | 'Low' | 'Over' | 'Blocked';
  value: number;
  velocity: 'Fast' | 'Slow' | 'Dead';
};

export const stocks: Stock[] = [
  { id: 's1', sku: 'RM-STL-04', name: 'Steel Coil 4mm',     category: 'Raw Material', unit: 'kg',  qty: 210,  reorder: 500, reserved: 60, warehouse: 'WH-1 / Rack A2', movement: '2h ago', health: 'Low', value: 168000, velocity: 'Fast' },
  { id: 's2', sku: 'RM-BRS-12', name: 'Brass Rod 12mm',     category: 'Raw Material', unit: 'kg',  qty: 84,   reorder: 200, reserved: 30, warehouse: 'WH-1 / Rack B1', movement: '1d ago', health: 'Low', value: 92400,  velocity: 'Fast' },
  { id: 's3', sku: 'FG-BRK-220',name: 'CNC Bracket 220mm',  category: 'Finished Goods', unit: 'pcs', qty: 480, reorder: 200, reserved: 200, warehouse: 'WH-2 / FG-3',   movement: '4h ago', health: 'OK', value: 88320,   velocity: 'Fast' },
  { id: 's4', sku: 'PK-CTN-L',  name: 'Carton Box Large',   category: 'Packaging',     unit: 'pcs', qty: 1200,reorder: 500, reserved: 200, warehouse: 'WH-1 / Rack P1', movement: '1d ago', health: 'OK', value: 21600,  velocity: 'Slow' },
  { id: 's5', sku: 'WIP-GBX',   name: 'Gearbox Housing WIP',category: 'WIP',           unit: 'pcs', qty: 96,  reorder: 50,  reserved: 96,  warehouse: 'WIP / Floor B',  movement: '20m ago',health: 'OK', value: 88320,  velocity: 'Fast' },
  { id: 's6', sku: 'SP-BRG-62', name: 'Bearing 6203',       category: 'Spare Parts',   unit: 'pcs', qty: 28,  reorder: 40,  reserved: 0,   warehouse: 'WH-3 / SP-2',    movement: '3d ago', health: 'Low', value: 11200,  velocity: 'Slow' },
  { id: 's7', sku: 'RM-ALU-06', name: 'Aluminium Sheet 6mm',category: 'Raw Material', unit: 'kg',  qty: 940,  reorder: 300, reserved: 80,  warehouse: 'WH-1 / Rack A4', movement: '6h ago', health: 'Over',value: 470000, velocity: 'Slow' },
  { id: 's8', sku: 'FG-IMP-01', name: 'Pump Impeller',      category: 'Finished Goods',unit: 'pcs', qty: 0,   reorder: 50,  reserved: 0,   warehouse: 'WH-2 / FG-1',    movement: '8d ago', health: 'Blocked', value: 0, velocity: 'Dead' },
];

// ───────────── Procurement ─────────────
export const purchaseRequests = [
  { id: 'PR-501', requester: 'Stores',      dept: 'Production', item: 'Steel Coil 4mm',     qty: '500 kg',  required: '23 Apr', urgency: 'High',   status: 'Pending Approval' },
  { id: 'PR-502', requester: 'Maintenance', dept: 'Plant',      item: 'Bearing 6203',       qty: '60 pcs',  required: '25 Apr', urgency: 'Medium', status: 'Approved' },
  { id: 'PR-503', requester: 'QC',          dept: 'Quality',    item: 'Caliper 0-300mm',    qty: '4 pcs',   required: '30 Apr', urgency: 'Low',    status: 'Pending Approval' },
];

export const rfqs = [
  { id: 'RFQ-211', item: 'Steel Coil 4mm',     vendors: 4, bestPrice: 78,  bestVendor: 'Jindal Steel',  status: 'Open' },
  { id: 'RFQ-212', item: 'Brass Rod 12mm',     vendors: 3, bestPrice: 540, bestVendor: 'Bombay Metals', status: 'Comparing' },
];

export const purchaseOrders = [
  { id: 'PO-1051', vendor: 'Jindal Steel',      item: 'Steel Coil 4mm', qty: '1000 kg', value: 78000,  status: 'In Transit',     eta: '24 Apr' },
  { id: 'PO-1052', vendor: 'SKF India',         item: 'Bearing 6203',   qty: '200 pcs', value: 64000,  status: 'Partial Receipt',eta: '23 Apr' },
  { id: 'PO-1053', vendor: 'Bombay Metals',     item: 'Brass Rod 12mm', qty: '300 kg',  value: 162000, status: 'Approved',       eta: '28 Apr' },
];

// ───────────── Vendors ─────────────
export const vendors = [
  { id: 'V01', name: 'Jindal Steel',       category: 'Raw Material', city: 'Mumbai',    item: 'Steel Coil', rating: 4.6, leadTime: 5, reliability: 92, pendingOrders: 2, payment: 'On Time',  status: 'Active' },
  { id: 'V02', name: 'SKF India',          category: 'Spare Parts',  city: 'Pune',      item: 'Bearings',   rating: 4.8, leadTime: 4, reliability: 96, pendingOrders: 1, payment: 'On Time',  status: 'Active' },
  { id: 'V03', name: 'Bombay Metals',      category: 'Raw Material', city: 'Mumbai',    item: 'Brass / Cu', rating: 4.2, leadTime: 7, reliability: 84, pendingOrders: 1, payment: 'Overdue',  status: 'Active' },
  { id: 'V04', name: 'Pune Castings Co.',  category: 'Casting',      city: 'Pune',      item: 'Castings',   rating: 4.0, leadTime: 9, reliability: 78, pendingOrders: 0, payment: 'On Time',  status: 'Active' },
  { id: 'V05', name: 'Surat Plastics',     category: 'Packaging',    city: 'Surat',     item: 'Cartons',    rating: 3.8, leadTime: 3, reliability: 88, pendingOrders: 0, payment: 'On Time',  status: 'Inactive' },
];

// ───────────── QC ─────────────
export const qcInspections = [
  { id: 'QC-901', batch: 'B17', order: 'A102', product: 'CNC Bracket 220mm',  qty: 200, inspector: 'M. Joshi',  stage: 'Final',     status: 'In Inspection', defects: 12, rejectPct: 6.0 },
  { id: 'QC-902', batch: 'B20', order: 'A105', product: 'Sheet Metal Cover',  qty: 500, inspector: 'P. Rao',    stage: 'Pre-Dispatch', status: 'Pending Inspection', defects: 0, rejectPct: 0 },
  { id: 'QC-903', batch: 'B14', order: 'A101', product: 'Hub Assembly',       qty: 120, inspector: 'D. Shah',   stage: 'In-Process',status: 'Passed',       defects: 2, rejectPct: 1.6 },
  { id: 'QC-904', batch: 'B12', order: 'A099', product: 'Pinion Gear',        qty: 80,  inspector: 'M. Joshi',  stage: 'Final',     status: 'Rejected',     defects: 9, rejectPct: 11.2 },
  { id: 'QC-905', batch: 'B15', order: 'A100', product: 'Shaft 200mm',        qty: 150, inspector: 'P. Rao',    stage: 'In-Process',status: 'Rework',       defects: 5, rejectPct: 3.3 },
  { id: 'QC-906', batch: 'B13', order: 'A098', product: 'Flange 6"',          qty: 60,  inspector: 'D. Shah',   stage: 'Final',     status: 'Hold',         defects: 0, rejectPct: 0 },
];

export const qcChecklist = [
  { item: 'Outer Diameter (Ø 220mm ±0.05)', value: '220.02 mm', tol: '±0.05', pass: true },
  { item: 'Inner Bore (Ø 60mm ±0.02)',      value: '59.99 mm',  tol: '±0.02', pass: true },
  { item: 'Surface Roughness Ra ≤ 3.2',     value: '2.8',       tol: '≤ 3.2', pass: true },
  { item: 'Hardness HRC 28-32',             value: '34',        tol: '28-32', pass: false },
  { item: 'Visual / Burrs',                 value: 'Minor',     tol: 'None',  pass: false },
  { item: 'Threading M12 x 1.75',           value: 'Pass',      tol: 'Gauge', pass: true },
];

// ───────────── Machines ─────────────
export const machines = [
  { id: 'CNC-03', name: 'CNC Lathe #3', line: 'Line A', status: 'Overheating', temp: 86, vib: 'High',    runtime: 7.4, downtime: 0.4, util: 88, due: '02 May', tone: 'danger' },
  { id: 'VMC-01', name: 'VMC #1',       line: 'Line B', status: 'Running',     temp: 62, vib: 'Normal',  runtime: 7.6, downtime: 0.2, util: 92, due: '15 May', tone: 'success' },
  { id: 'PRS-04', name: 'Press #4',     line: 'Line A', status: 'Running',     temp: 54, vib: 'Normal',  runtime: 8.0, downtime: 0.0, util: 98, due: '12 May', tone: 'success' },
  { id: 'FUR-02', name: 'Furnace #2',   line: 'Line C', status: 'Maintenance', temp: 71, vib: 'Normal',  runtime: 4.2, downtime: 3.8, util: 52, due: '22 Apr', tone: 'warning' },
  { id: 'CNC-05', name: 'CNC Lathe #5', line: 'Line B', status: 'Idle',        temp: 36, vib: 'Normal',  runtime: 0.0, downtime: 8.0, util: 0,  due: '28 Apr', tone: 'info' },
  { id: 'LAT-02', name: 'Lathe #2',     line: 'Line D', status: 'Sensor Fault',temp: 0,  vib: 'Sensor!', runtime: 0.0, downtime: 8.0, util: 0,  due: '20 Apr', tone: 'danger' },
];

export const maintenanceLog = [
  { id: 'M-44', date: '18 Apr', machine: 'VMC-01', type: 'Preventive',  tech: 'R. Patil',  hours: 1.5, cost: 4200 },
  { id: 'M-43', date: '14 Apr', machine: 'PRS-04', type: 'Lubrication', tech: 'S. Kale',   hours: 0.8, cost: 1800 },
  { id: 'M-42', date: '11 Apr', machine: 'FUR-02', type: 'Breakdown',   tech: 'A. Khan',   hours: 4.0, cost: 18400 },
];

// ───────────── Dispatch ─────────────
export const dispatches = [
  { id: 'D-3301', order: 'A105', client: 'Bajaj Industries', vehicle: 'MH12 KQ 8821', driver: 'S. Pawar',  destination: 'Aurangabad', eta: 'Today 18:30',  status: 'In Transit' },
  { id: 'D-3302', order: 'A102', client: 'Tata Forge Ltd.',  vehicle: 'MH14 BR 4412', driver: 'R. Singh',  destination: 'Pune',       eta: 'Tomorrow 11:00', status: 'Scheduled' },
  { id: 'D-3303', order: 'A107', client: 'JSW Steel',        vehicle: 'GJ05 AT 2210', driver: 'M. Chauhan',destination: 'Surat',      eta: 'Delivered 16:40', status: 'Delivered' },
  { id: 'D-3304', order: 'A106', client: 'Ashok Leyland',    vehicle: 'TN09 LM 9911', driver: 'K. Murugan',destination: 'Chennai',    eta: 'Delayed +1 day', status: 'Delayed' },
];

// ───────────── Invoices / Payments ─────────────
export const invoices = [
  { id: 'INV-7701', client: 'Tata Forge Ltd.',  amount: 248400, due: '10 Apr', status: 'Overdue', days: 12 },
  { id: 'INV-7702', client: 'Bajaj Industries', amount: 210000, due: '24 Apr', status: 'Pending', days: 0 },
  { id: 'INV-7703', client: 'JSW Steel',        amount: 1152000,due: '14 Apr', status: 'Paid',    days: 0 },
  { id: 'INV-7704', client: 'Mahindra Auto',    amount: 442000, due: '02 May', status: 'Draft',   days: 0 },
  { id: 'INV-7705', client: 'Hero MotoCorp',    amount: 176000, due: '12 Apr', status: 'Overdue', days: 10 },
];

// ───────────── Tasks / Team ─────────────
export const teamTasks = [
  { id: 'T-101', title: 'Approve PR-501 Steel Coil',     assignee: 'A. Bose',     due: 'Today', priority: 'High',   status: 'Open' },
  { id: 'T-102', title: 'Re-inspect Batch B19 castings', assignee: 'M. Joshi',    due: 'Today', priority: 'High',   status: 'In Progress' },
  { id: 'T-103', title: 'Schedule maintenance CNC-03',   assignee: 'R. Patil',    due: 'Tomorrow', priority: 'Medium', status: 'Open' },
  { id: 'T-104', title: 'Confirm dispatch for A102',     assignee: 'V. Desai',    due: 'Today', priority: 'High',   status: 'Open' },
  { id: 'T-105', title: 'Update vendor scorecard Q2',    assignee: 'P. Menon',    due: '30 Apr', priority: 'Low',    status: 'Open' },
];

// ───────────── Approvals ─────────────
export const approvals = [
  { id: 'AP-21', type: 'Purchase Request',  ref: 'PR-501', value: '₹78,000',  raisedBy: 'Stores',   level: 'Plant Manager' },
  { id: 'AP-22', type: 'Quotation',         ref: 'Q-2043', value: '₹7,44,000',raisedBy: 'Sales',    level: 'Owner' },
  { id: 'AP-23', type: 'Production Hold',   ref: 'B19',    value: '—',         raisedBy: 'Supervisor', level: 'Plant Manager' },
  { id: 'AP-24', type: 'Vendor Onboarding', ref: 'V-NEW-09',value: '—',        raisedBy: 'Procurement', level: 'Owner' },
];

// ───────────── Notifications / Alerts ─────────────
export const notifications = [
  { id: 'N1', type: 'Low Stock',         text: 'Steel Coil 4mm below reorder',    time: '10m', tone: 'warning', screen: 'Inventory' },
  { id: 'N2', type: 'Delayed Production',text: 'Batch B19 holding for material',  time: '32m', tone: 'orange',  screen: 'ProductionLive' },
  { id: 'N3', type: 'QC Rejection',      text: 'Batch B17 — 6.2% rejects',        time: '1h',  tone: 'danger',  screen: 'QC' },
  { id: 'N4', type: 'Machine Fault',     text: 'CNC-03 overheating 86°C',         time: '1h',  tone: 'danger',  screen: 'Machines' },
  { id: 'N5', type: 'Payment Pending',   text: 'Tata Forge ₹2.48L overdue 12d',   time: '3h',  tone: 'warning', screen: 'Invoices' },
  { id: 'N6', type: 'Dispatch Delay',    text: 'D-3304 delayed by 1 day',         time: '4h',  tone: 'orange',  screen: 'Dispatch' },
];

// ───────────── Reports ─────────────
export const reports = [
  { id: 'R1', title: 'Daily Production Report', subtitle: 'Output, rejects, downtime', icon: '🏭' },
  { id: 'R2', title: 'Sales / Orders Report',   subtitle: 'New, confirmed, delivered',  icon: '📈' },
  { id: 'R3', title: 'Stock Report',            subtitle: 'Stock-in, stock-out, value', icon: '📦' },
  { id: 'R4', title: 'QC Report',               subtitle: 'Pass / Reject / Rework',     icon: '🔬' },
  { id: 'R5', title: 'Dispatch Report',         subtitle: 'Vehicles, ETA, delays',      icon: '🚚' },
  { id: 'R6', title: 'Financial Summary',       subtitle: 'Receivables, payables',      icon: '💰' },
];

export const roles = [
  'Owner', 'Plant Manager', 'Supervisor', 'Inventory',
  'QC', 'Dispatch', 'Accounts', 'Procurement',
];
