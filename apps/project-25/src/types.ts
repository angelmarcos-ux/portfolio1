export interface CatalogItem {
  sku: string
  name: string
  category: string
  store: string
  warehouse: string
  stock: number
  min: number
  sold: number
  price: number
}

export interface Warehouse {
  name: string
  city: string
  role: string
  load: number
  open: number
  doors: number
  zones: string
  skus: number
  sqft: number
  sync: string
}

export type Notify = (msg: string, ok?: boolean) => void