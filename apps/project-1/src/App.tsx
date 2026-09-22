import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createChart,
  CrosshairMode,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Cpu,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  Zap,
} from 'lucide-react'
import {
  PAIR_KEYS,
  TF,
  TF_KEYS,
  buildBook,
  buildCandles,
  createSim,
  fmt,
  type Candle,
  type PairKey,
  type Sim,
} from './sim'

export interface ChartApi {
  rebuild: () => void
  tick: (now: number) => void
}

function Chart({
  symbol,
  tfKey,
  simRef,
  apiRef,
}: {
  symbol: PairKey
  tfKey: string
  simRef: React.MutableRefObject<Sim>
  apiRef: React.MutableRefObject<ChartApi | null>
}) {
  const holderRef = useRef<HTMLDivElement>(null)
  const room = useRef<{
    chart?: IChartApi
    candle?: ISeriesApi<'Candlestick'>
    vol?: ISeriesApi<'Histogram'>
    last?: Candle
  }>({})

  useEffect(() => {
    const el = holderRef.current
    if (!el) return

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8b95a7',
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.06)' },
        horzLines: { color: 'rgba(148,163,184,0.06)' },
      },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.12)' },
      timeScale: {
        borderColor: 'rgba(148,163,184,0.12)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { mode: CrosshairMode.Normal },
    })

    const candle = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    const vol = chart.addHistogramSeries({
      priceScaleId: 'vol',
      priceFormat: { type: 'volume' },
    })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })

    const roomObj = { chart, candle, vol }
    room.current = roomObj

    const render = () => {
      const candles = buildCandles(symbol, tfKey, simRef.current)
      candle.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })),
      )
      vol.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.volume,
          color: c.close >= c.open ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.45)',
        })),
      )
      room.current.last = candles[candles.length - 1]
      chart.timeScale().fitContent()
    }
    render()

    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth }))
    ro.observe(el)

    apiRef.current = {
      rebuild: render,
      tick: (now: number) => {
        const sec = TF[tfKey]?.sec ?? TF['1H'].sec
        const bucket = Math.floor(now / sec) * sec
        const last = room.current.last
        const price = simRef.current.pairs[symbol].price
        if (!last) return

        let cur: Candle
        if (bucket > last.time) {
          cur = {
            time: bucket,
            open: last.close,
            high: Math.max(last.close, price),
            low: Math.min(last.close, price),
            close: price,
            volume: volumeEst(last.close, price),
          }
        } else {
          cur = { ...last }
          cur.high = Math.max(cur.high, price)
          cur.low = Math.min(cur.low, price)
          cur.close = price
          cur.volume += volumeEst(last.close, price)
        }
        room.current.last = cur
        candle.update({
          time: cur.time as UTCTimestamp,
          open: cur.open,
          high: cur.high,
          low: cur.low,
          close: cur.close,
        })
        vol.update({
          time: cur.time as UTCTimestamp,
          value: cur.volume,
          color: cur.close >= cur.open ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.45)',
        })
      },
    }

    return () => {
      ro.disconnect()
      chart.remove()
      room.current = {}
      apiRef.current = null
    }
  }, [symbol, tfKey, simRef, apiRef])

  return <div ref={holderRef} className="chart-window" />
}

const volumeEst = (a: number, b: number) => 2 + Math.abs(b - a) * 0.02 + Math.random() * 6

const sentimentFace = (s: number) => (s >= 56 ? 'bull' : s <= 44 ? 'bear' : 'flat')

export default function App() {
  const simRef = useRef<Sim>(undefined as unknown as Sim)
  if (!simRef.current) simRef.current = createSim()

  const [active, setActive] = useState<PairKey>('BTC/USD')
  const [tfKey, setTfKey] = useState('1H')
  const [tick, setTick] = useState(0)
  const [qty, setQty] = useState('0.10')
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null)
  const apiRef = useRef<ChartApi | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const sim = simRef.current
  const pair = sim.pairs[active]
  const book = useMemo(() => buildBook(pair), [pair, tick])
  const equity =
    sim.cash + sim.positions.reduce((s, p) => s + sim.pairs[p.symbol].price * p.qty, 0)
  const unreal = sim.positions.reduce((s, p) => {
    const mark = sim.pairs[p.symbol].price
    return s + (mark - p.entry) * p.qty
  }, 0)
  const totalPnl = sim.realized + unreal

  useEffect(() => {
    const id = window.setInterval(() => {
      simRef.current.step()
      apiRef.current?.tick(Math.floor(Date.now() / 1000))
      setTick((t) => t + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const showToast = (msg: string, err = false) => {
    setToast({ msg, err })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  const execute = (side: 'buy' | 'sell') => {
    const n = parseFloat(qty)
    if (!(n > 0)) return showToast('Enter a valid quantity', true)
    const price = pair.price
    const notional = n * price
    if (side === 'buy') {
      if (notional > sim.cash) return showToast('Insufficient cash', true)
      sim.cash -= notional
      const pos = sim.positions.find((p) => p.symbol === active)
      if (pos) {
        pos.entry = (pos.entry * pos.qty + price * n) / (pos.qty + n)
        pos.qty += n
      } else {
        sim.positions.push({ symbol: active, qty: n, entry: price })
      }
    } else {
      const pos = sim.positions.find((p) => p.symbol === active)
      if (!pos || pos.qty < n) return showToast('Insufficient position to sell', true)
      sim.realized += (price - pos.entry) * n
      pos.qty -= n
      sim.cash += notional
      if (pos.qty < 1e-9) sim.positions = sim.positions.filter((p) => p.symbol !== active)
    }
    sim.trades.unshift({ id: Date.now(), side, symbol: active, qty: n, price, time: Date.now() })
    if (sim.trades.length > 10) sim.trades.length = 10
    showToast(`${side === 'buy' ? 'Bought' : 'Sold'} ${n} ${active} @ ${fmt(price, pair.dp)}`)
    setTick((t) => t + 1)
  }

  const switchPair = (k: PairKey) => {
    setActive(k)
    requestAnimationFrame(() => apiRef.current?.rebuild())
  }

  const switchTf = (k: string) => {
    setTfKey(k)
  }

  const priceClass = (up: boolean) => (up ? 'pos' : 'neg')

  return (
    <div className="app">
      <div className="bg-stage" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="topbar">
        <div className="tooltip-brand">
          <div className="brand-mark"><BarChart3 size={20} /></div>
          <div>
            <p className="brand-name">QUANT<span>TRADE</span></p>
            <p className="brand-sub">Institutional Platform</p>
          </div>
        </div>

        <div className="symbol-tabs">
          {PAIR_KEYS.map((k) => (
            <button
              key={k}
              className={active === k ? 'sym-tab active' : 'sym-tab'}
              style={{ ['--accent' as string]: sim.pairs[k].color }}
              onClick={() => switchPair(k)}
            >
              <span className="live-dot" style={{ ['--dot' as string]: sim.pairs[k].color }} />
              {k}
            </button>
          ))}
        </div>

        <div className="top-actions">
          <span className="status-pill">
            <span className="pulse-dot" /> System Operational
          </span>
          <button className="icon-btn" aria-label="Alerts"><Bell size={17} /></button>
          <div className="avatar"><User size={15} /></div>
        </div>
      </header>

      <div className="ticker-strip">
        {PAIR_KEYS.map((k) => {
          const P = sim.pairs[k]
          const up = P.chg24 >= 0
          return (
            <button key={k} className={active === k ? 'ticker-chip active' : 'ticker-chip'} onClick={() => switchPair(k)}>
              <span className="chip-symbol" style={{ color: P.color }}>{k}</span>
              <span className="chip-price">${fmt(P.price, P.dp)}</span>
              <span className={priceClass(up)}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {up ? '+' : ''}{P.chg24.toFixed(2)}%
              </span>
            </button>
          )
        })}
      </div>

      <main className="dash-grid">
        <div className="col-left">
          <section className="card panel a1">
            <div className="card-head">
              <h3><Wallet size={15} /> Portfolio</h3>
              <span className="up-badge">Paper</span>
            </div>
            <div className="equity-line">
              <span>Equity</span>
              <strong className={totalPnl >= 0 ? 'pos' : 'neg'}>${fmt(equity, 2)}</strong>
            </div>
            <div className="equity-line sm">
              <span>Unrealized P&amp;L</span>
              <strong className={unreal >= 0 ? 'pos' : 'neg'}>
                {unreal >= 0 ? '+' : ''}${fmt(unreal, 2)}
              </strong>
            </div>
            <div className="mini-stat-row">
              <div><span>Realized</span><b className={sim.realized >= 0 ? 'pos' : 'neg'}>{sim.realized >= 0 ? '+' : ''}${fmt(sim.realized)}</b></div>
              <div><span>Cash</span><b>${fmt(sim.cash, 0)}</b></div>
              <div><span>Fees</span><b>0.00%</b></div>
            </div>
          </section>

          <section className="card panel a2">
            <div className="card-head">
              <h3><Cpu size={15} /> AI Sentiment Engine</h3>
              <span className="up-badge">Neo</span>
            </div>
            <div className="sent-list">
              {PAIR_KEYS.map((k) => {
                const P = sim.pairs[k]
                const face = sentimentFace(P.sent)
                const spark = P.sentHist
                const pts = spark
                  .map((v, i) => {
                    const x = (i / Math.max(spark.length - 1, 1)) * 100
                    const y = 40 - ((v - 5) / 90) * 40
                    return `${x.toFixed(1)},${y.toFixed(1)}`
                  })
                  .join(' ')
                return (
                  <button key={k} className="sent-row" onClick={() => switchPair(k)}>
                    <div className="sent-top">
                      <span className="chip-symbol" style={{ color: P.color }}>{k}</span>
                      <span className={face === 'bull' ? 'pos' : face === 'bear' ? 'neg' : 'flat'}>
                        {face === 'bull' ? 'Bullish' : face === 'bear' ? 'Bearish' : 'Neutral'} {Math.round(P.sent)}
                      </span>
                    </div>
                    <div className="sent-bar-track">
                      <div
                        className={face === 'bull' ? 'sent-bar bull' : face === 'bear' ? 'sent-bar bear' : 'sent-bar flat'}
                        style={{ width: `${P.sent}%` }}
                      />
                    </div>
                    <svg className="spark" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <polyline points={pts} fill="none" stroke={P.color} strokeWidth="1.6" opacity="0.85" />
                    </svg>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="col-center">
          <section className="card panel a3 chart-card">
            <div className="chart-head">
              <div>
                <div className="chart-title">
                  <h2>{active}</h2>
                  <span className={`live-badge ${pair.price >= 0 ? '' : ''}`}><span className="pulse-dot" /> LIVE MOCK FEED</span>
                </div>
                <div className="chart-price-row">
                  <strong className="chart-price">${fmt(pair.price, pair.dp)}</strong>
                  <span className={priceClass(pair.chg24 >= 0)}>
                    {pair.chg24 >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    {pair.chg24 >= 0 ? '+' : ''}{pair.chg24.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="tf-tabs">
                {TF_KEYS.map((k) => (
                  <button key={k} className={tfKey === k ? 'tf-tab active' : 'tf-tab'} onClick={() => switchTf(k)}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <Chart symbol={active} tfKey={tfKey} simRef={simRef} apiRef={apiRef} />

            <div className="chart-stats">
              <div><span>24h High</span><b>${fmt(pair.high24, pair.dp)}</b></div>
              <div><span>24h Low</span><b>${fmt(pair.low24, pair.dp)}</b></div>
              <div><span>24h Vol</span><b>${fmt(pair.vol24, 0)}</b></div>
              <div><span>Sentiment</span><b>{Math.round(pair.sent)}/100</b></div>
            </div>
          </section>

          <section className="card panel a4 exec-card">
            <div className="card-head">
              <h3><Zap size={15} /> Quick Execution · {active}</h3>
              <span className="up-badge">0 slippage</span>
            </div>
            <div className="exec-body">
              <div className="field">
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min="0"
                  step="0.01"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Est. Notional</label>
                <div className="notional">${fmt((parseFloat(qty) || 0) * pair.price, pair.dp)}</div>
              </div>
              <button className="buy-btn" onClick={() => execute('buy')}>
                <TrendingUp size={15} /> Buy {active.split('/')[0]}
              </button>
              <button className="sell-btn" onClick={() => execute('sell')}>
                <TrendingDown size={15} /> Sell {active.split('/')[0]}
              </button>
            </div>
          </section>
        </div>

        <div className="col-right">
          <section className="card panel a5 book-card">
            <div className="card-head">
              <h3><Activity size={15} /> Order Book · {active}</h3>
              <span className="up-badge">depth 10</span>
            </div>
            <div className="book-head-row">
              <span>Price</span><span>Size</span><span>Total</span>
            </div>
            <div className="ob-body">
              <div className="ob-side asks">
                {book.asks.map((l, i) => (
                  <div key={`a${i}`} className="ob-row">
                    <span className="ob-bar ask" style={{ width: `${l.width}%` }} />
                    <span className="ob-price neg">${fmt(l.price)}</span>
                    <span className="ob-cell">{fmt(l.size, 4)}</span>
                    <span className="ob-cell dim">{fmt(l.total, 1)}</span>
                  </div>
                ))}
              </div>
              <div className="spread-row">
                <span>${fmt(book.mid, 2)}</span>
                <b>Spread {fmt(book.spread)}</b>
              </div>
              <div className="ob-side bids">
                {book.bids.map((l, i) => (
                  <div key={`b${i}`} className="ob-row">
                    <span className="ob-bar bid" style={{ width: `${l.width}%` }} />
                    <span className="ob-price pos">${fmt(l.price)}</span>
                    <span className="ob-cell">{fmt(l.size, 4)}</span>
                    <span className="ob-cell dim">{fmt(l.total, 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card panel a6">
            <div className="card-head">
              <h3><ShieldCheck size={15} /> Open Positions</h3>
              <span className="up-badge">{sim.positions.length}</span>
            </div>
            <div className="table">
              <div className="thead"><span>Pair</span><span>Qty</span><span>Entry</span><span>P&amp;L</span></div>
              {sim.positions.length === 0 && <p className="empty">No open positions</p>}
              {sim.positions.map((p) => {
                const mark = sim.pairs[p.symbol].price
                const pnl = (mark - p.entry) * p.qty
                return (
                  <div key={p.symbol} className="trow">
                    <span className="chip-symbol" style={{ color: sim.pairs[p.symbol].color }}>{p.symbol}</span>
                    <span>{p.qty}</span>
                    <span>${fmt(p.entry)}</span>
                    <span className={pnl >= 0 ? 'pos' : 'neg'}>{pnl >= 0 ? '+' : ''}${fmt(pnl)}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="card panel a7">
            <div className="card-head">
              <h3><Sparkles size={15} /> Recent Executions</h3>
              <span className="up-badge">live</span>
            </div>
            <div className="feed">
              {sim.trades.length === 0 && <p className="empty">Your executions will appear here</p>}
              {sim.trades.map((t) => (
                <div key={t.id} className="feed-row">
                  <span className={t.side === 'buy' ? 'side buy' : 'side sell'}>{t.side === 'buy' ? 'B' : 'S'}</span>
                  <div className="feed-main">
                    <b>{t.side === 'buy' ? 'Bought' : 'Sold'} {t.qty} {t.symbol}</b>
                    <span>{new Date(t.time).toLocaleTimeString('en-GB')}</span>
                  </div>
                  <span className="feed-price">${fmt(t.price, 2)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {toast && (
        <div className={toast.err ? 'toast err' : 'toast'}>
          {toast.err ? <ShieldCheck size={16} /> : <Activity size={16} />}
          {toast.msg}
        </div>
      )}

      <footer className="foot">
        <span>QuantTrade Institutional Platform</span>
        <span>React + TypeScript + Lightweight Charts</span>
        <span>Simulated market data · for demo only</span>
      </footer>
    </div>
  )
}