<template>
  <div class="min-h-screen bg-[#050505] text-slate-300 relative overflow-x-hidden">
    <!-- Ambient background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div class="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[130px]" />
      <div class="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div class="absolute inset-0" :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)' }" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl sticky top-0">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            <Vault class="w-5 h-5 text-[#1c1503]" />
          </div>
          <div>
            <h1 class="text-white font-bold text-lg leading-tight">ChainVault <span class="text-amber-400">Custody</span></h1>
            <p class="text-[11px] text-slate-500 font-mono">Institutional multi-signature storage · L1: {{ currentBlock }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 text-right">
          <div>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">AUM</p>
            <p class="text-white font-bold font-mono text-sm">{{ fmtTvl(tvl) }}</p>
          </div>
          <p class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All systems operational
          </p>
          <button
            @click="openCreate"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#1c1503] text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            <Send class="w-4 h-4" /> Create Transfer
          </button>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
      <!-- Stat row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="s in stats" :key="s.label" class="rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-4 hover:border-amber-500/30 transition">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ s.label }}</p>
            <div :class="s.color"><component :is="s.icon" class="w-4 h-4" /></div>
          </div>
          <p class="text-2xl font-bold text-white font-mono">{{ s.value }}</p>
          <p class="text-xs mt-1" :class="s.trendClass">{{ s.trend }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Wallets -->
        <section class="lg:col-span-3 rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wallet class="w-4 h-4 text-amber-400" /> Wallets
            </h2>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-slate-400">{{ wallets.length }} vaults</span>
          </div>
          <div class="space-y-3">
            <button
              v-for="w in wallets"
              :key="w.id"
              @click="selectWallet(w.id)"
              :class="['w-full text-left rounded-xl border p-3.5 transition', activeWalletId === w.id ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-white/3 border-white/8 hover:border-amber-500/30']"
            >
              <div class="flex items-center justify-between mb-1.5">
                <p class="text-sm font-semibold text-white">{{ w.name }}</p>
                <Shield :class="w.enabled ? 'text-emerald-400' : 'text-slate-600'" class="w-4 h-4" />
              </div>
              <p class="font-mono text-[11px] text-slate-500 mb-2">{{ shortAddr(w.address) }}</p>
              <div class="flex items-center justify-between">
                <p class="font-mono text-sm text-amber-300 font-bold">{{ fmtBal(w.balance, w.asset) }}</p>
                <span class="text-[11px] text-slate-500 font-mono border border-white/10 rounded px-1.5 py-0.5">{{ w.sigs }}/{{ w.required }}-sig</span>
              </div>
              <div class="flex items-center gap-1.5 mt-2">
                <span v-for="n in w.required" :key="n" class="w-1.5 h-1.5 rounded-full" :class="n <= w.sigs ? 'bg-amber-400' : 'bg-white/10'" />
              </div>
            </button>
          </div>
          <button
            @click="openCreate"
            class="mt-4 w-full py-2.5 border border-dashed border-white/15 hover:border-amber-500/50 text-amber-300 text-xs font-semibold rounded-xl transition bg-white/2 hover:bg-amber-500/5"
          >
            + Add Vault
          </button>
        </section>

        <!-- Approval queue -->
        <section class="lg:col-span-6 rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSignature class="w-4 h-4 text-emerald-400" /> Transaction Approval Queue
            </h2>
            <span :class="['text-[11px] px-2 py-0.5 rounded-full font-mono border', pendingTxs.length ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400']">
              {{ pendingTxs.length }} pending
            </span>
          </div>

          <div v-if="pendingTxs.length === 0" class="rounded-xl border border-dashed border-white/10 p-10 text-center">
            <CheckCircle2 class="w-8 h-8 text-emerald-400/60 mx-auto mb-3" />
            <p class="text-slate-400 text-sm">Queue is clear. All transfers have been approved and settled.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="tx in pendingTxs" :key="tx.id" class="rounded-xl border border-white/8 bg-white/3 p-4 hover:border-emerald-500/25 transition">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', tx.asset === 'ETH' ? 'bg-indigo-500/15 text-indigo-300' : tx.asset === 'BTC' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300']">
                    <Coins class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-white font-semibold text-sm">{{ tx.amount }} {{ tx.asset }} <span class="text-slate-500 font-normal">→</span> <span class="font-mono text-amber-300/90" @click="copyText(tx.to)">{{ shortAddr(tx.to) }}</span></p>
                    <p class="text-xs text-slate-500 mt-0.5 font-mono">Created by {{ tx.creator }} · {{ tx.note }} · {{ tx.time }}</p>
                  </div>
                </div>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0', tx.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300']">
                  {{ tx.status === 'pending' ? 'awaiting sigs' : 'settled' }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center gap-2">
                  <span v-for="n in tx.required" :key="n" class="w-2 h-2 rounded-full" :class="n <= tx.sigs ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-white/10'" />
                  <span class="text-[11px] text-slate-500 font-mono">{{ tx.sigs }}/{{ tx.required }} signatures</span>
                </div>
                <div class="flex gap-2">
                  <button
                    v-if="tx.status === 'pending'"
                    @click="approveTx(tx.id)"
                    class="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    v-if="tx.status === 'pending'"
                    @click="rejectTx(tx.id)"
                    class="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-semibold hover:bg-red-500/25 transition flex items-center gap-1.5"
                  >
                    <X class="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 border-t border-white/5 pt-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap class="w-3.5 h-3.5 text-amber-400" /> Authorized Contracts
            </h3>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <div v-for="c in contracts" :key="c.address" class="rounded-lg border border-white/8 bg-white/3 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-xs text-white font-semibold flex items-center gap-1.5"><Box class="w-3.5 h-3.5 text-cyan-300 shrink-0" /> {{ c.name }}</p>
                  <p class="font-mono text-[10px] text-slate-600">{{ shortAddr(c.address) }}</p>
                </div>
                <button
                  @click="executeContract(c)"
                  class="shrink-0 text-[11px] px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-semibold hover:bg-cyan-500/25 transition flex items-center gap-1"
                >
                  <Play class="w-3 h-3" /> Execute
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Activity -->
        <section class="lg:col-span-3 rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity class="w-4 h-4 text-cyan-400" /> Ledger
            </h2>
            <button @click="refreshLedger" class="text-slate-500 hover:text-white transition" title="Refresh">
              <RefreshCw :class="['w-3.5 h-3.5', refreshing ? 'animate-spin' : '']" />
            </button>
          </div>
          <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1 ledger-scroll">
            <div v-for="e in ledger" :key="e.id" class="relative pl-4 border-l-2" :class="e.type === 'err' ? 'border-red-500/40' : e.type === 'exec' ? 'border-emerald-500/40' : 'border-white/10'">
              <span :class="['absolute -left-[5px] top-1.5 w-2 h-2 rounded-full', e.type === 'err' ? 'bg-red-400' : e.type === 'exec' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-slate-500']" />
              <p class="text-xs text-slate-300 leading-snug">{{ e.msg }}</p>
              <p class="text-[10px] font-mono text-slate-600 mt-0.5">{{ e.hash }} · {{ e.time }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer status -->
      <div class="mt-8 flex items-center justify-between flex-wrap gap-3 border-t border-white/5 pt-5">
        <p class="text-xs text-slate-600 font-mono flex items-center gap-2">
          <Lock class="w-3.5 h-3.5 text-emerald-400" /> 3-of-5 HSM secured · audit trail immutable · {{ currentBlock }} finalized secure
        </p>
        <p class="text-xs text-slate-600 font-mono">Genesis trust rooted 2026 · TSS threshold signatures</p>
      </div>
    </main>

    <!-- Toasts -->
    <div class="fixed top-20 right-5 z-50 flex flex-col gap-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['backdrop-blur border rounded-xl px-4 py-3 text-sm shadow-2xl flex items-start gap-2.5',
            t.type === 'ok' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100'
            : t.type === 'err' ? 'bg-red-500/15 border-red-500/30 text-red-100'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-100']"
        >
          <CheckCircle2 v-if="t.type === 'ok'" class="w-4 h-4 mt-0.5 shrink-0" />
          <TriangleAlert v-else-if="t.type === 'warn'" class="w-4 h-4 mt-0.5 shrink-0" />
          <Ban v-else class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ t.msg }}</span>
        </div>
      </TransitionGroup>
    </div>

    <!-- Create Transfer -->
    <div
      v-if="showCreate"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showCreate = false"
    >
      <div class="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Send class="w-5 h-5 text-amber-400" /> Create Transfer
        </h3>
        <p class="text-sm text-slate-500 mb-5">Proposal requires {{ requiredSigs }} of {{ signerCount }} signers to settle.</p>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Asset</label>
            <select v-model="newTx.asset" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Amount</label>
            <input v-model="newTx.amount" type="text" placeholder="0.00" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50" />
          </div>
        </div>
        <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Destination address</label>
        <input v-model="newTx.to" type="text" placeholder="0x… or bc1…" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 mb-2" />
        <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Memo</label>
        <input v-model="newTx.note" type="text" placeholder="e.g. Counterparty settlement Q3" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 mb-6" @keyup.enter="createTransfer" />
        <div class="flex gap-3">
          <button @click="showCreate = false" class="flex-1 py-2.5 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition">Cancel</button>
          <button @click="createTransfer" :disabled="!newTx.amount || !newTx.to" class="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-[#1c1503] text-sm font-bold rounded-xl transition">Create Proposal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Component } from 'vue'
import {
  Vault, Shield, Coins, CheckCircle2, X, Wallet, Layers,
  FileSignature, Activity, Box, RefreshCw, Lock, Send, Play, Zap, TriangleAlert, Ban,
} from 'lucide-vue-next'

interface Wallet {
  id: number
  name: string
  address: string
  asset: string
  balance: number
  sigs: number
  required: number
  enabled: boolean
}

interface PendingTx {
  id: number
  asset: string
  amount: string
  to: string
  creator: string
  note: string
  time: string
  sigs: number
  required: number
  status: 'pending' | 'settled'
}

interface Contract { name: string; address: string }
interface LedgerItem { id: number; msg: string; hash: string; time: string; type: 'info' | 'exec' | 'err' }
interface Stat { label: string; value: string; trend: string; trendClass: string; color: string; icon: Component }

const wallets = ref<Wallet[]>([
  { id: 1, name: 'Primary Treasury', address: '0x7A2f...91c4', asset: 'BTC', balance: 418.25, sigs: 3, required: 3, enabled: true },
  { id: 2, name: 'Liquidity Reserve', address: '0x3Be8...d02f', asset: 'ETH', balance: 5240.4, sigs: 2, required: 3, enabled: true },
  { id: 3, name: 'Stablecoin Ops', address: '0xC9d1...88ab', asset: 'USDC', balance: 9200000, sigs: 2, required: 2, enabled: true },
  { id: 4, name: 'Cold Storage', address: '0xEf1a...5b77', asset: 'BTC', balance: 2031.9, sigs: 4, required: 5, enabled: false },
  { id: 5, name: 'Validator Treasury', address: '0x52D8...c3e6', asset: 'ETH', balance: 833.6, sigs: 3, required: 4, enabled: true },
])
const activeWalletId = ref(1)
const requiredSigs = ref(2)
const signerCount = ref(3)

const contracts = ref<Contract[]>([
  { name: 'Staking Router', address: '0x1111...aaaa' },
  { name: 'Payroll Stream', address: '0x2222...bbbb' },
  { name: 'Whitelist Oracle', address: '0x3333...cccc' },
])

let txId = 0
const pendingTxs = ref<PendingTx[]>([
  { id: ++txId, asset: 'BTC', amount: '0.42', to: 'bc1q…x9f2', creator: 'ops.1', note: 'OTC settlement', time: '2m ago', sigs: 1, required: 3, status: 'pending' },
  { id: ++txId, asset: 'USDC', amount: '250,000', to: '0x9D…77e1', creator: 'finance.2', note: 'Payroll cycle 08', time: '18m ago', sigs: 2, required: 2, status: 'pending' },
  { id: ++txId, asset: 'ETH', amount: '120.5', to: '0x4A…c209', creator: 'trading.3', note: 'Liquidity top-up', time: '1h ago', sigs: 1, required: 3, status: 'pending' },
])

let ledgerId = 0
const ledger = ref<LedgerItem[]>([
  { id: ++ledgerId, msg: 'Cold storage re-key ceremony completed', hash: '0x9f2a', time: '08:04 UTC', type: 'info' },
  { id: ++ledgerId, msg: 'Payroll Stream executed — 250,000 USDC', hash: '0x4c8e', time: '07:52 UTC', type: 'exec' },
  { id: ++ledgerId, msg: 'Approval timeout — proposal <b>#0211</b> expired', hash: '0xaa31', time: '07:11 UTC', type: 'err' },
  { id: ++ledgerId, msg: 'Withdrawal approved 3/3 by signing group', hash: '0x1d07', time: '06:48 UTC', type: 'exec' },
  { id: ++ledgerId, msg: 'New signer added to Primary Treasury', hash: '0xb392', time: '06:02 UTC', type: 'info' },
])

const toasts = ref<{ id: number; msg: string; type: 'ok' | 'warn' | 'err' }[]>([])
let toastSeq = 0

const currentBlock = ref(21_440_118)
const refreshing = ref(false)
const showCreate = ref(false)
const newTx = ref({ asset: 'BTC', amount: '', to: '', note: '' })

const activeWallet = computed(() => wallets.value.find(w => w.id === activeWalletId.value)!)

const tvl = computed(() => {
  const s = wallets.value.reduce((acc, w) => acc + w.balance * (w.asset === 'BTC' ? 67200 : w.asset === 'ETH' ? 3580 : 1), 0)
  return s
})

const fmtTvl = (v: number) => {
  if (v >= 1e9) return `$ ${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$ ${(v / 1e6).toFixed(1)}M`
  return `$ ${v.toLocaleString()}`
}

const fmtBal = (b: number, asset: string) =>
  asset === 'USDC' || b >= 1000 ? b.toLocaleString(undefined, { maximumFractionDigits: 0 }) : b.toFixed(2)

const shortAddr = (a: string) => (a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a)

const stats: Stat[] = [
  { label: 'Total Value Locked', value: '$ 43.7B', trend: '+2.4% 24h', trendClass: 'text-emerald-400', color: 'text-amber-400', icon: Layers },
  { label: 'Multi-sig Vaults', value: '128', trend: '6 new this month', trendClass: 'text-emerald-400', color: 'text-emerald-400', icon: Vault },
  { label: 'Pending Approvals', value: '3', trend: 'avg settle 9m', trendClass: 'text-slate-400', color: 'text-cyan-400', icon: FileSignature },
  { label: 'Contracts Executed', value: '2,847', trend: '99.98% success', trendClass: 'text-emerald-400', color: 'text-indigo-400', icon: Box },
]

const pushToast = (msg: string, type: 'ok' | 'warn' | 'err' = 'ok') => {
  const id = ++toastSeq
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4200)
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    pushToast('Address copied to clipboard.', 'ok')
  } catch {
    pushToast('Clipboard unavailable.', 'warn')
  }
}

const selectWallet = (id: number) => {
  activeWalletId.value = id
  pushToast(`${wallets.value.find(w => w.id === id)!.name} selected.`, 'ok')
}

const approveTx = (id: number) => {
  const tx = pendingTxs.value.find(t => t.id === id)
  if (!tx || tx.status !== 'pending') return
  tx.sigs += 1
  if (tx.sigs >= tx.required) {
    tx.status = 'settled'
    ledger.value.unshift({
      id: ++ledgerId,
      msg: `Transfer settled — ${tx.amount} ${tx.asset} released to ${shortAddr(tx.to)}`,
      hash: `0x${Math.random().toString(16).slice(2, 6)}`,
      time: 'just now',
      type: 'exec',
    })
    pushToast(`Transfer settled — ${tx.amount} ${tx.asset}.`, 'ok')
  } else {
    pushToast(`Signature recorded (${tx.sigs}/${tx.required}). More approvals required.`, 'ok')
  }
}

const rejectTx = (id: number) => {
  const tx = pendingTxs.value.find(t => t.id === id)!
  pendingTxs.value = pendingTxs.value.filter(t => t.id !== id)
  ledger.value.unshift({
    id: ++ledgerId,
    msg: `Proposal rejected — ${tx.amount} ${tx.asset} to ${shortAddr(tx.to)} blocked`,
    hash: `0x${Math.random().toString(16).slice(2, 6)}`,
    time: 'just now',
    type: 'err',
  })
  pushToast('Proposal rejected and logged to ledger.', 'err')
}

const openCreate = () => {
  newTx.value = { asset: 'BTC', amount: '', to: '', note: '' }
  showCreate.value = true
}

const createTransfer = () => {
  if (!newTx.value.amount || !newTx.value.to) return
  pendingTxs.value.unshift({
    id: ++txId,
    asset: newTx.value.asset,
    amount: newTx.value.amount,
    to: newTx.value.to,
    creator: 'you',
    note: newTx.value.note || 'Manual transfer',
    time: 'just now',
    sigs: 1,
    required: requiredSigs.value,
    status: 'pending',
  })
  showCreate.value = false
  pushToast(`Proposal created — ${newTx.value.amount} ${newTx.value.asset} awaiting ${requiredSigs.value} signatures.`, 'ok')
}

const executeContract = (c: Contract) => {
  if (pendingTxs.value.some(t => t.note === c.name)) {
    pushToast(`${c.name} already has a pending proposal.`, 'warn')
    return
  }
  pendingTxs.value.unshift({
    id: ++txId,
    asset: 'ETH',
    amount: '0.00',
    to: c.address,
    creator: 'governance',
    note: c.name,
    time: 'just now',
    sigs: 1,
    required: 2,
    status: 'pending',
  })
  pushToast(`${c.name} execution proposed — needs 1 more approval.`, 'ok')
}

const refreshLedger = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    ledger.value.unshift({
      id: ++ledgerId,
      msg: 'Ledger re-indexed with HSM attestation',
      hash: `0x${Math.random().toString(16).slice(2, 6)}`,
      time: 'just now',
      type: 'info',
    })
    pushToast('Ledger verified against chain.', 'ok')
  }, 800)
}

let ticker: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  ticker = setInterval(() => {
    currentBlock.value += Math.floor(Math.random() * 3)
    tvlPulse()
  }, 3500)
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})

const tvlPulse = () => {
  const w = activeWallet.value
  if (Math.random() > 0.72) {
    const delta = w.balance * (Math.random() * 0.001)
    w.balance = w.asset === 'USDC' ? w.balance + delta : w.balance + delta * (Math.random() > 0.5 ? 1 : -1)
  }
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.ledger-scroll::-webkit-scrollbar {
  width: 4px;
}
.ledger-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}

/* keep template-monospace Copy cue but unused icon import in footer */
</style>