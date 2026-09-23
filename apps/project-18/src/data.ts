import type { CatalogItem, Warehouse } from './types'

export const catalog: CatalogItem[] = [
  { sku: 'SL-9921', name: 'Sole Air Cushion', category: 'Footwear', store: 'Sunset', warehouse: 'Miami DC', stock: 34, min: 80, sold: 618, price: 89 },
  { sku: 'TR-8821', name: 'Trail Pack 32L', category: 'Outdoor', store: 'Coconut Grove', warehouse: 'Orlando Hub', stock: 41, min: 62, sold: 412, price: 129 },
  { sku: 'WT-1104', name: 'Waveline Tank', category: 'Apparel', store: 'South Beach', warehouse: 'Tampa Spoke', stock: 26, min: 55, sold: 533, price: 45 },
  { sku: 'HT-5570', name: 'Harbor Tee (navy)', category: 'Apparel', store: 'Downtown', warehouse: 'Miami DC', stock: 19, min: 48, sold: 489, price: 32 },
  { sku: 'RB-3341', name: 'Ridge Boot (ankle)', category: 'Footwear', store: 'Downtown', warehouse: 'Miami DC', stock: 0, min: 40, sold: 358, price: 175 },
  { sku: 'ST-2205', name: 'Solstice Sun Hat', category: 'Accessories', store: 'Sunset', warehouse: 'Tampa Spoke', stock: 12, min: 35, sold: 296, price: 28 },
  { sku: 'DK-7789', name: 'Drift Jacket (shell)', category: 'Outdoor', store: 'South Beach', warehouse: 'Orlando Hub', stock: 9, min: 30, sold: 201, price: 210 },
  { sku: 'CC-4510', name: 'Coast Cooler 24', category: 'Hardgoods', store: 'Coconut Grove', warehouse: 'Miami DC', stock: 63, min: 20, sold: 144, price: 119 },
  { sku: 'UV-8890', name: 'UltraVue Sunglasses', category: 'Accessories', store: 'Downtown', warehouse: 'Tampa Spoke', stock: 88, min: 25, sold: 502, price: 75 },
  { sku: 'SN-1126', name: 'Swell Short (5")', category: 'Apparel', store: 'South Beach', warehouse: 'Orlando Hub', stock: 104, min: 60, sold: 720, price: 48 },
  { sku: 'PD-6603', name: 'Paddle Board 10.6', category: 'Hardgoods', store: 'Sunset', warehouse: 'Miami DC', stock: 6, min: 18, sold: 87, price: 699 },
  { sku: 'SK-9074', name: 'Storm Kite (12m)', category: 'Hardgoods', store: 'Coconut Grove', warehouse: 'Tampa Spoke', stock: 17, min: 22, sold: 129, price: 849 },
]

export const warehouses: Warehouse[] = [
  { name: 'Miami DC', city: 'Medley, FL', role: 'Distribution Centre', load: 74, open: 6, doors: 12, zones: 'Dry · Cold · Hazmat', skus: 3420, sqft: 185000, sync: '2 min ago' },
  { name: 'Orlando Hub', city: 'Orlando, FL', role: 'Regional Hub', load: 41, open: 4, doors: 8, zones: 'Dry · Cold', skus: 1180, sqft: 92000, sync: '7 min ago' },
  { name: 'Tampa Spoke', city: 'Tampa, FL', role: 'Last-mile Spoke', load: 58, open: 3, doors: 6, zones: 'Dry', skus: 640, sqft: 41000, sync: '12 min ago' },
]