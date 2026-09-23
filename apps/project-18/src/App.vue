<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Store, Package, Boxes, Warehouse, RefreshCw, CheckCircle2, TriangleAlert,
  TrendingUp, Truck, CalendarDays, PieChart, PackagePlus,
  ShoppingCart, ScanLine, Bell, Sun, Moon, Settings, BarChart3, Box,
} from 'lucide-vue-next'

const theme = ref<'dark' | 'light'>('dark')
const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark')
const clock = ref(new Date())
setInterval(() => (clock.value = new Date()), 1000)
const liveClock = computed(() =>
  clock.value.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
)
const today = computed(() =>
  clock.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
)

/* ---- data ---- */
interface Reorder { sku: string; name: string; store: string; stock: number; min: number; sold: number }
const reorder = ref<Reorder[]>([
  { sku: 'SL-9921', name: 'Sole Air Cushion', store: 'Sunset', stock: 34, min: 80, sold: 618 },
  { sku: 'TR-8821', name: 'Trail Pack 32L', store: 'Coconut Grove', stock: 41, min: 62, sold: 412 },
  { sku: 'WT-1104', name: 'Waveline Tank', store: 'South Beach', stock: 26, min: 55, sold: 533 },
  { sku: 'HT-5570', name: 'Harbor Tee (navy)', store: 'Downtown', stock: 19, min: 48, sold: 489 },
])

const warehouses = ref([
  { name: 'Miami DC', city: 'Medley, FL', load: 74, open: 6 },
  { name: 'Orlando Hub', city: 'Orlando, FL', load: 41, open: 4 },
  { name: 'Tampa Spoke', city: 'Tampa, FL', load: 58, open: 3 },
])

const channelShare = [
  { name: 'In-Store POS', pct: 46, color: '#6366f1' },
  { name: 'E-com', pct: 34, color: '#22d3ee' },
  { name: 'Marketplace', pct: 13, color: '#a78bfa' },
  { name: 'Wholesale', pct: 7, color: '#fb7185' },
]

const lowStock = computed(() => reorder.value.filter((r) => r.stock < r.min))
const inventoryValue = 2_840_000
const fillRate = 97.2

const activeFilter = ref<'all' | 'low' | 'out'>('low')
const filtered = computed(() =>
  activeFilter.value === 'all'
    ? reorder.value
    : activeFilter.value === 'low'
      ? lowStock.value
      : reorder.value.filter((r) => r.stock === 0),
)

/* ---- actions ---- */
const toasts = ref<{ id: number; msg: string; ok: boolean }[]>([])
let tid = 0
const toast = (msg: string, ok = true) => {
  const id = ++tid
  toasts.value.push({ id, msg, ok })
  setTimeout(() => (toasts.value = toasts.value.filter((t) => t.id !== id)), 3200)
}
const showModal = ref(false)
const reorderQty = ref(40)
const placeOrder = () => {
  if (reorderQty.value <= 0) return toast('Enter a quantity >= 1', false)
  toast(`Purchase order submitted · ${reorderQty.value} units scheduled for 2-day arrival`)
  reorderQty.value = 40
}
const restockAll = () => toast('Auto-reorder created for all low-stock SKUs')
const syncNow = () => toast('Synced with 6 POS terminals · 18,204 transactions')
</script>

<template>
  <div :class="theme" class="min-h-screen bg-[#07070f] text-slate-100 font-sans">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 hidden md:flex flex-col gap-5 p-5 border-r border-white/10 bg-white/[0.02]">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center"><Store :size="18" /></div>
          <div><p class="font-bold leading-tight">CloudScale</p><p class="text-[11px] text-slate-400">CI/CD Autopilot</p></div>
        </div>
        <nav class="flex flex-col gap-1 text-sm">
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-500/15 text-sky-300 font-medium"><BarChart3 :size="16" /> Overview</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><Package :size="16" /> Inventory</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><Warehouse :size="16" /> Warehouses</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><ShoppingCart :size="16" /> Orders</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><Truck :size="16" /> Logistics</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><Settings :size="16" /> Settings</span>
        </nav>
        <div class="mt-auto rounded-xl p-3.5 bg-indigo-500/10 border border-indigo-500/20">
          <div class="flex items-center gap-2 text-indigo-300"><Bell :size="14" /><p class="text-xs font-semibold">Low-stock alerts</p></div>
          <p class="text-[11px] text-slate-400 mt-1">{{ lowStock.length }} SKUs below minimum · action needed</p>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 p-5 md:p-7">
        <header class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2.5">CloudScale Automator<span class="text-sky-400">Dashboard</span>
              <span class="text-[11px] font-normal px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Live</span>
            </h1>
            <p class="text-sm text-slate-400 mt-1 flex items-center gap-2"><CalendarDays :size="14" /> {{ today }} · {{ liveClock }} · 6 stores</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="syncNow" class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10"><RefreshCw :size="15" /> Sync</button>
            <button @click="toggleTheme" class="p-2 rounded-lg bg-white/5 border border-white/10"><Sun v-if="theme === 'dark'" :size="16" /><Moon v-else :size="16" /></button>
          </div>
        </header>

        <!-- Stat cards -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Today Sales</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-sky-400"><TrendingUp :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">$48,290</p>
            <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +12.4% vs yesterday</p>
          </div>
          <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Open Orders</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><ShoppingCart :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">312</p>
            <p class="text-[12px] text-slate-400 mt-1">28 to fulfill today</p>
          </div>
          <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Inventory Value</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><Boxes :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">${{ inventoryValue.toLocaleString() }}</p>
            <p class="text-[12px] text-slate-400 mt-1">across 3 warehouses</p>
          </div>
          <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Fill Rate</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">{{ fillRate }}%</p>
            <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +0.6pt this week</p>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Reorder table -->
          <section class="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <div class="flex items-center gap-2"><TriangleAlert :size="16" class="text-amber-400" /><h2 class="font-semibold">Reorder Alerts</h2></div>
              <div class="flex items-center gap-1.5">
                <button v-for="f in ['all', 'low', 'out'] as const" :key="f" @click="activeFilter = f"
                  class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="activeFilter === f ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
                  {{ f }}<span v-if="f === 'low'"> ({{ lowStock.length }})</span><span v-else-if="f === 'out'"> ({{ reorder.filter(r => r.stock === 0).length }})</span>
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
                  <th class="px-4 py-3">SKU</th><th class="px-4 py-3">Product</th><th class="px-4 py-3">Store</th><th class="px-4 py-3 text-right">Stock</th><th class="px-4 py-3 text-right">Sold 7d</th><th class="px-4 py-3"></th>
                </tr></thead>
                <tbody>
                  <tr v-for="r in filtered" :key="r.sku" class="border-b border-white/5 hover:bg-white/[0.03]">
                    <td class="px-4 py-3 font-mono text-xs text-indigo-300">{{ r.sku }}</td>
                    <td class="px-4 py-3 font-medium">{{ r.name }}</td>
                    <td class="px-4 py-3 text-[12px] text-slate-400">{{ r.store }}</td>
                    <td class="px-4 py-3 text-right"><span :class="r.stock === 0 ? 'text-rose-400 font-semibold' : 'text-amber-300'">{{ r.stock }}</span><span class="text-slate-500"> / min {{ r.min }}</span></td>
                    <td class="px-4 py-3 text-right text-slate-300">{{ r.sold }}</td>
                    <td class="px-4 py-3 text-right"><button @click="toast(`Reorder queued for ${r.name}`)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 text-sky-300 text-[12px] hover:bg-indigo-500/25"><PackagePlus :size="13" /> Reorder</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Channel share -->
          <section class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div class="flex items-center gap-2 mb-4"><PieChart :size="16" class="text-violet-400" /><h2 class="font-semibold">Sales by Channel</h2></div>
            <div class="flex items-center justify-center py-4">
              <div class="relative w-40 h-40 rounded-full" style="background: conic-gradient(#6366f1 0 46%, #22d3ee 46% 80%, #a78bfa 80% 93%, #fb7185 93% 100%)">
                <div class="absolute inset-5 rounded-full bg-[#0b0b18] flex items-center justify-center text-center"><div><p class="text-2xl font-bold">100%</p><p class="text-[11px] text-slate-400">GMV</p></div></div>
              </div>
            </div>
            <div class="space-y-2.5">
              <div v-for="c in channelShare" :key="c.name" class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full" :style="{ background: c.color }"></span>{{ c.name }}</span>
                <span class="text-slate-400">{{ c.pct }}%</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Warehouse load -->
        <section class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center gap-2 mb-4"><Warehouse :size="16" class="text-sky-400" /><h2 class="font-semibold">Warehouse Load</h2><span class="text-xs text-slate-400">· 3 facilities</span></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div v-for="w in warehouses" :key="w.name" class="rounded-xl p-3 bg-black/20 border border-white/10">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium">{{ w.name }}</p>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{{ w.load <= 75 ? 'Healthy' : 'Heavy' }}</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ w.city }} · {{ w.open }} dock doors open</p>
              <div class="h-2 rounded-full bg-white/10 mt-3"><div class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" :style="{ width: w.load + '%' }"></div></div>
            </div>
          </div>
        </section>

        <footer class="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-400">
          <span class="flex items-center gap-2"><Box :size="14" /> {{ lowStock.length }} SKUs flagged for auto-reorder</span>
          <div class="flex items-center gap-3">
            <button @click="restockAll" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-[12px] hover:bg-emerald-500/25"><RefreshCw :size="13" /> Auto-restock all</button>
            <span>CloudScale Automatorv2.4 · data synced 2 min ago</span>
          </div>
        </footer>
      </main>
    </div>

    <!-- Quick reorder modal -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-[#0d0d1a] border border-white/10 p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2"><ScanLine :size="18" class="text-sky-400" /><h3 class="font-semibold">Quick Reorder</h3></div>
            <button @click="showModal = false" class="p-1.5 rounded-lg text-slate-400 hover:bg-white/10">✕</button>
          </div>
          <label class="block text-[12px] text-slate-400 mb-4">Trigger a purchase order to replenish stock across all stores.</label>
          <label class="block text-[12px] text-slate-400">Reorder qty</label>
          <input v-model.number="reorderQty" type="number" min="1" class="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
          <button @click="placeOrder" class="mt-4 w-full py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400">Submit purchase order</button>
        </div>
      </div>
    </transition>

    <!-- Toasts -->
    <teleport to="body">
      <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id"
            :class="t.ok ? 'border-emerald-500/40 text-emerald-200' : 'border-rose-500/40 text-rose-200'"
            class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0d0d1a] border text-sm shadow-2xl">
            <CheckCircle2 v-if="t.ok" :size="16" /><TriangleAlert v-else :size="16" />{{ t.msg }}
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
