export type PairKey = 'BTC/USD' | 'ETH/USD' | 'SOL/USD'

export interface PricePoint {
  t: number
  p: number
}

export interface PairState {
  symbol: PairKey
  base: number
  price: number
  dp: number
  color: string
  hist: PricePoint[]
  p24idx: number
  chg24: number
  sent: number
  sentHist: number[]
  vol24: number
  high24: number
  low24: number
}

export interface TradingPos {
  symbol: PairKey
  qty: number
  entry: number
}

export interface Trade {
  id: number
  side: 'buy' | 'sell'
  symbol: PairKey
  qty: number
  price: number
  time: number
}

export interface Level {
  price: number
  size: number
  total: number
  width: number
}

export interface Book {
  asks: Level[]
  bids: Level[]
  mid: number
  spread: number
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Sim {
  pairs: Record<PairKey, PairState>
  cash: number
  realized: number
  positions: TradingPos[]
  trades: Trade[]
  step: () => void
}

export const PAIR_KEYS: PairKey[] = ['BTC/USD', 'ETH/USD', 'SOL/USD']

export const TF: Record<string, { sec: number; count: number }> = {
  '1H': { sec: 60, count: 120 },
  '4H': { sec: 300, count: 120 },
  '1D': { sec: 1800, count: 150 },
  '1W': { sec: 14400, count: 168 },
}

export const TF_KEYS = Object.keys(TF)

export const fmt = (n: number, dp = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })

function seedHist(base: number, days = 30, stepSec = 300): PricePoint[] {
  const now = Math.floor(Date.now() / 1000)
  const start = now - days * 86400
  const hist: PricePoint[] = []
  let p = base * (0.96 + Math.random() * 0.08)
  for (let t = start; t <= now; t += stepSec) {
    const pull = (base - p) * 0.0022
    const shock = p * (Math.random() - 0.5) * 0.014
    p = Math.max(0.01, p + pull + shock)
    hist.push({ t, p })
  }
  hist[hist.length - 1].p = base
  return hist
}

export function createSim(): Sim {
  const defs: { symbol: PairKey; base: number; dp: number; color: string }[] = [
    { symbol: 'BTC/USD', base: 64230.5, dp: 1, color: '#3b82f6' },
    { symbol: 'ETH/USD', base: 3125.4, dp: 2, color: '#8b5cf6' },
    { symbol: 'SOL/USD', base: 143.2, dp: 2, color: '#22d3ee' },
  ]

  const pairs = {} as Record<PairKey, PairState>
  for (const d of defs) {
    const hist = seedHist(d.base)
    pairs[d.symbol] = {
      symbol: d.symbol,
      base: d.base,
      price: d.base,
      dp: d.dp,
      color: d.color,
      hist,
      p24idx: 0,
      chg24: 0,
      sent: 50 + Math.random() * 30,
      sentHist: [],
      vol24: Math.round(60 + Math.random() * 200) * 1000,
      high24: d.base * 1.04,
      low24: d.base * 0.96,
    }
  }

  const sim: Sim = {
    pairs,
    cash: 125000,
    realized: 0,
    positions: [
      { symbol: 'BTC/USD', qty: 0.45, entry: 62800 },
      { symbol: 'ETH/USD', qty: 6.2, entry: 3050 },
      { symbol: 'SOL/USD', qty: 120, entry: 151.8 },
    ],
    trades: [],
    step() {
      const now = Math.floor(Date.now() / 1000)
      for (const key of PAIR_KEYS) {
        const P = pairs[key]
        const prev = P.price
        const mom = (P.price - P.base) / P.base
        const pull = (P.base - P.price) * 0.012
        const shock = P.price * (Math.random() - 0.5) * 0.004
        P.price = Math.max(0.01, P.price + pull + shock + mom * P.price * 0.0006)
        P.hist.push({ t: now, p: P.price })
        if (P.hist.length > 30000) {
          P.hist.shift()
          if (P.p24idx > 0) P.p24idx--
        }
        while (P.p24idx < P.hist.length - 1 && P.hist[P.p24idx].t < now - 86400) P.p24idx++
        const ref = P.hist[P.p24idx]
        P.chg24 = ref ? ((P.price - ref.p) / ref.p) * 100 : 0
        P.high24 = Math.max(P.high24, P.price)
        P.low24 = Math.min(P.low24, P.price)

        const target = Math.min(95, Math.max(5, 50 + mom * 550 + (Math.random() - 0.5) * 7))
        P.sent = P.sent + (target - P.sent) * 0.05
        P.sentHist.push(P.sent)
        if (P.sentHist.length > 40) P.sentHist.shift()
        void prev
      }
    },
  }

  return sim
}

export function buildBook(pair: PairState): Book {
  const mid = pair.price
  const step = mid * 0.00012
  const asks: Level[] = []
  const bids: Level[] = []
  let maxCum = 0

  let cum = 0
  for (let i = 1; i <= 10; i++) {
    const price = mid + step * i
    const size = +(Math.random() * 1.1 + 0.02).toFixed(4)
    cum += size * price
    maxCum = Math.max(maxCum, cum)
    asks.push({ price, size, total: cum, width: 0 })
  }
  cum = 0
  for (let i = 1; i <= 10; i++) {
    const price = mid - step * i
    if (price <= 0) continue
    const size = +(Math.random() * 1.1 + 0.02).toFixed(4)
    cum += size * price
    maxCum = Math.max(maxCum, cum)
    bids.push({ price, size, total: cum, width: 0 })
  }
  for (const a of asks) a.width = (a.total / maxCum) * 100
  for (const b of bids) b.width = (b.total / maxCum) * 100

  return {
    asks,
    bids,
    mid,
    spread: +(asks[0].price - bids[0].price).toFixed(2),
  }
}

export function buildCandles(symbol: PairKey, tfKey: string, sim: Sim): Candle[] {
  const { sec, count } = TF[tfKey] ?? TF['1H']
  const hist = sim.pairs[symbol].hist
  const now = Math.floor(Date.now() / 1000)
  const end = Math.ceil(now / sec) * sec
  const start = end - sec * count
  const bins: Candle[] = []
  const filled = new Array(count).fill(false)

  for (let i = 0; i < count; i++) {
    bins.push({ time: start + i * sec, open: 0, high: 0, low: Infinity, close: 0, volume: 0 })
  }

  for (const pt of hist) {
    if (pt.t < start) continue
    const bi = Math.floor((pt.t - start) / sec)
    if (bi < 0 || bi >= count) continue
    const b = bins[bi]
    if (!filled[bi]) {
      b.open = pt.p
      filled[bi] = true
    }
    b.high = Math.max(b.high, pt.p)
    b.low = Math.min(b.low, pt.p)
    b.close = pt.p
    b.volume += 1 + Math.random() * 2
  }

  let prevClose: number | null = null
  for (let i = 0; i < bins.length; i++) {
    const b = bins[i]
    if (!filled[i]) {
      const ref = prevClose ?? sim.pairs[symbol].base
      const c = ref * (1 + (Math.random() - 0.5) * 0.004)
      b.open = ref
      b.close = c
      b.high = Math.max(ref, c) * 1.0012
      b.low = Math.min(ref, c) * 0.9988
      b.volume = 2 + Math.random() * 8
    }
    prevClose = b.close
  }

  return bins
}