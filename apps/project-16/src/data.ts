import { ref } from 'vue'
import type { Property, Parcel, MarketArea, Comparable } from './types'

export const properties = ref<Property[]>([
  { addr: '1201 Brickell Bay Dr', area: 'Brickell', type: 'Luxury Condo', value: 1280000, yield: 48, status: 'live', beds: 3, baths: 2, sqft: 1840 },
  { addr: '581 NE 27th St', area: 'Wynwood', type: 'Office Loft', value: 860000, yield: 66, status: 'offer', beds: 0, baths: 2, sqft: 2310 },
  { addr: '200 S Biscayne Blvd', area: 'Downtown', type: 'Retail Strip', value: 3420000, yield: 55, status: 'live', beds: 0, baths: 4, sqft: 4200 },
  { addr: '76 SW 8th St', area: 'Little Havana', type: 'Multi-family', value: 1450000, yield: 72, status: 'offer', beds: 6, baths: 4, sqft: 3100 },
  { addr: '901 Arthur Godfrey Rd', area: 'Miami Beach', type: 'Single Family', value: 2750000, yield: 39, status: 'live', beds: 5, baths: 4, sqft: 3680 },
])

export const parcels: Parcel[] = [
  { id: 'LB-001', name: 'Edgewater Parcel', area: 'Edgewater', acres: 2.4, zoning: 'Mixed-Use', pricePerAcre: 1850000, value: 4440000, status: 'Held', yield: 4.2 },
  { id: 'LB-002', name: 'Doral Gateway', area: 'Doral', acres: 6.1, zoning: 'Industrial', pricePerAcre: 920000, value: 5612000, status: 'Under Option', yield: 5.6 },
  { id: 'LB-003', name: 'Little River Yards', area: 'Little River', acres: 8.9, zoning: 'Residential', pricePerAcre: 760000, value: 6764000, status: 'Held', yield: 3.1 },
  { id: 'LB-004', name: 'Overtown Block 14', area: 'Overtown', acres: 1.2, zoning: 'Retail', pricePerAcre: 1400000, value: 1680000, status: 'Under Offer', yield: 6.8 },
  { id: 'LB-005', name: 'Hialeah Corridor', area: 'Hialeah', acres: 12.7, zoning: 'Industrial', pricePerAcre: 610000, value: 7747000, status: 'Held', yield: 6.1 },
]

export const marketAreas: MarketArea[] = [
  { name: 'Brickell', avgPrice: 1850, count: 8, heat: 92 },
  { name: 'Wynwood', avgPrice: 1120, count: 5, heat: 78 },
  { name: 'Downtown', avgPrice: 1430, count: 7, heat: 81 },
  { name: 'Miami Beach', avgPrice: 2620, count: 6, heat: 88 },
  { name: 'Edgewater', avgPrice: 1990, count: 4, heat: 74 },
  { name: 'Little Havana', avgPrice: 690, count: 3, heat: 46 },
]

export const comparables: Comparable[] = [
  { addr: '1188 Brickell Bay Dr', area: 'Brickell', type: 'Condo', price: 1312000, sqft: 1840, psf: 713, beds: 3, baths: 2, sim: 0.96, status: 'Sold' },
  { addr: '1200 Brickell Bay Dr', area: 'Brickell', type: 'Condo', price: 1395000, sqft: 1940, psf: 719, beds: 3, baths: 2, sim: 0.95, status: 'Sold' },
  { addr: '1220 Brickell Ave', area: 'Brickell', type: 'Condo', price: 1246000, sqft: 1720, psf: 724, beds: 3, baths: 2, sim: 0.92, status: 'Sold' },
  { addr: '1100 Brickell Bay Dr', area: 'Brickell', type: 'Condo', price: 1178000, sqft: 1590, psf: 741, beds: 2, baths: 2, sim: 0.89, status: 'Sold' },
  { addr: '555 NW 24th St', area: 'Wynwood', type: 'Loft', price: 880000, sqft: 2210, psf: 398, beds: 2, baths: 2, sim: 0.84, status: 'Sold' },
  { addr: '90 NW 29th St', area: 'Wynwood', type: 'Office', price: 1210000, sqft: 3340, psf: 362, beds: 0, baths: 3, sim: 0.8, status: 'Pending' },
  { addr: '301 S Biscayne Blvd', area: 'Downtown', type: 'Condo', price: 965000, sqft: 1480, psf: 652, beds: 2, baths: 2, sim: 0.72, status: 'Sold' },
  { addr: '82 SW 8th St', area: 'Little Havana', type: 'Multifamily', price: 1452000, sqft: 3100, psf: 468, beds: 6, baths: 4, sim: 0.63, status: 'Active' },
]

export const currency = (n: number) => '$' + n.toLocaleString('en-US')