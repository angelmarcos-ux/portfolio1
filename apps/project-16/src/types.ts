export interface Property {
  addr: string
  area: string
  type: string
  value: number
  yield: number
  status: 'live' | 'offer' | 'closed'
  beds: number
  baths: number
  sqft: number
}

export interface Parcel {
  id: string
  name: string
  area: string
  acres: number
  zoning: string
  pricePerAcre: number
  value: number
  status: 'Held' | 'Under Option' | 'Under Offer'
  yield: number
}

export interface MarketArea {
  name: string
  avgPrice: number
  count: number
  heat: number
}

export interface Comparable {
  addr: string
  area: string
  type: string
  price: number
  sqft: number
  psf: number
  beds: number
  baths: number
  sim: number
  status: 'Sold' | 'Pending' | 'Active'
}

export type Notify = (msg: string, ok?: boolean) => void