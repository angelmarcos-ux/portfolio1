<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Building2, TrendingUp, MapPin, Home, Key, Gauge, Coins, LandPlot,
  Search, Bath, ArrowUpRight, RefreshCw, Plus,
  CheckCircle2, Crown, Calculator, BarChart3,
} from 'lucide-vue-next'

const theme = ref<'dark' | 'light'>('dark')
const toggleTheme = () => { theme.value = theme.value === 'dark' ? 'light' : 'dark' }

/* ---- portfolio ---- */
const inventoryValue = computed(() =>
  properties.value.filter(p => p.status === 'live' || p.status === 'offer').reduce((n, p) => n + p.value, 0)
)
const yieldAvg = computed(() => (properties.value.reduce((n, p) => n + p.yield, 0) / properties.value.length).toFixed(2))

interface Property { addr: string; area: string; type: string; value: number; yield: number; status: 'live' | 'offer' | 'closed'; beds: number; baths: number; sqft: number }
const properties = ref<Property[]>([
  { addr: '1201 Brickell Bay Dr', area: 'Brickell', type: 'Luxury Condo', value: 1280000, yield: 48, status: 'live', beds: 3, baths: 2, sqft: 1840 },
  { addr: '581 NE 27th St', area: 'Wynwood', type: 'Office Loft', value: 860000, yield: 66, status: 'offer', beds: 0, baths: 2, sqft: 2310 },
  { addr: '200 S Biscayne Blvd', area: 'Downtown', type: 'Retail Strip', value: 3420000, yield: 55, status: 'live', beds: 0, baths: 4, sqft: 4200 },
  { addr: '76 SW 8th St', area: 'Little Havana', type: 'Multi-family', value: 1450000, yield: 72, status: 'offer', beds: 6, baths: 4, sqft: 3100 },
  { addr: '901 Arthur Godfrey Rd', area: 'Miami Beach', type: 'Single Family', value: 2750000, yield: 39, status: 'live', beds: 5, baths: 4, sqft: 3680 },
])

const active = computed(() => properties.value.filter(p => p.status !== 'closed').length)
const currency = (n: number) => '$' + n.toLocaleString('en-US')

/* ---- AVM model ---- */
const address = ref('')
const beds = ref(3)
const baths = ref(2)
const sqft = ref(1800)
const age = ref(12)
const comps = computed(() => [
  { addr: '1188 Brickell Bay Dr', diff: 840, val: 1312000, sim: 0.96 },
  { addr: '1220 Brickell Ave', diff: 620, val: 1246000, sim: 0.92 },
  { addr: '1100 Brickell Bay Dr', diff: 1400, val: 1178000, sim: 0.89 },
])
const avm = computed(() => 1180000 + sqft.value * 286 - age.value * 4200 + (beds.value - 3) * 98000 + (baths.value - 2) * 64000)

/* ---- actions / toast ---- */
const toasts = ref<{ id: number; msg: string }[]>([])
let tid = 0
const toast = (msg: string) => { const id = ++tid; toasts.value.push({ id, msg }); setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3400) }
const addListing = () => {
  if (!address.value.trim()) return toast('Enter an address to register the asset')
  properties.value.unshift({
    addr: address.value,
    area: 'New Entry',
    type: 'AVM Estimate',
    value: avm.value,
    yield: 51,
    status: 'offer',
    beds: beds.value,
    baths: baths.value,
    sqft: sqft.value,
  })
  toast(`Valuation registered for ${address.value}`)
  address.value = ''
}
const refresh = () => toast('AVM re-indexed against 214 comparables · confidence 93%')
const statusTone = (s: string) => s === 'live' ? 'text-emerald-400' : s === 'offer' ? 'text-amber-400' : 'text-slate-400'
</script>

<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen bg-[#f6f7fb] dark:bg-[#07070d] text-slate-900 dark:text-slate-100 font-sans transition-colors">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 hidden md:flex flex-col gap-5 p-5 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03]">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center"><Building2 :size="18" class="text-white" /></div>
          <div><p class="font-bold leading-tight">PropTech</p><p class="text-[11px] text-slate-400">Valuator</p></div>
        </div>
        <nav class="flex flex-col gap-1 text-sm">
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-sky-500/15 text-sky-400 font-medium"><Home :size="16" /> Portfolio</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><MapPin :size="16" /> Market Map</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><Calculator :size="16" /> AVM Studio</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><LandPlot :size="16" /> Land Bank</span>
          <span class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5"><BarChart3 :size="16" /> Comparables</span>
        </nav>
        <div class="mt-auto rounded-xl bg-sky-500/10 border border-sky-500/20 p-3.5">
          <div class="flex items-center gap-2 text-sky-300"><Crown :size="14" /><p class="text-xs font-semibold">Private Capital</p></div>
          <p class="text-[11px] text-slate-400 mt-1">$4.2M deployed across 3 funds</p>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 p-5 md:p-7">
        <header class="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2.5">PropTech <span class="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Valuator</span></h1>
            <p class="text-sm text-slate-400 mt-1">Property analytics · AVM scoring · deal desk</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="refresh" class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm hover:bg-slate-50 dark:hover:bg-white/10"><RefreshCw :size="15" /> Re-index</button>
            <button @click="toggleTheme" class="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors">🌙 / ☀️</button>
          </div>
        </header>

        <!-- Stat cards -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Portfolio Value</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><Coins :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">{{ currency(inventoryValue) }}</p>
            <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +6.4% QoQ</p>
          </div>
          <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Active Assets</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Key :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">{{ active }}</p>
            <p class="text-[12px] text-slate-400 mt-1">{{ properties.length }} total tracked</p>
          </div>
          <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Avg Gross Yield</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Gauge :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">{{ yieldAvg }}%</p>
            <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +0.8pt</p>
          </div>
          <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Pipeline Offers</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><LandPlot :size="16" /></span></div>
            <p class="text-2xl font-bold mt-2">{{ properties.filter(p => p.status === 'offer').length }}</p>
            <p class="text-[12px] text-slate-400 mt-1">awaiting sellers</p>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <!-- AVM model -->
          <section class="lg:col-span-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
            <div class="flex items-center gap-2 mb-4"><Calculator :size="16" class="text-sky-400" /><h2 class="font-semibold">Automated Valuation Model</h2></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <label class="block text-[12px]"><span class="text-slate-400">Beds</span><input v-model.number="beds" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
              <label class="block text-[12px]"><span class="text-slate-400">Baths</span><input v-model.number="baths" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
              <label class="block text-[12px]"><span class="text-slate-400">Sq. Ft.</span><input v-model.number="sqft" type="number" min="0" step="50" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
            </div>
            <label class="block text-[12px] mb-3"><span class="text-slate-400">Asset address</span><div class="relative"><Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="address" placeholder="e.g. 1501 Bay Rd, Miami" class="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500" /></div></label>
            <div class="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div>
                <p class="text-[12px] opacity-80">Estimated Market Value</p>
                <p class="text-3xl font-extrabold">{{ currency(avm) }}</p>
                <p class="text-[12px] opacity-80 mt-1">Confidence 93% · 214 comps</p>
              </div>
              <button @click="addListing" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold"><Plus :size="15" /> Register</button>
            </div>
          </section>

          <!-- Comparables -->
          <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
            <div class="flex items-center gap-2 mb-4"><BarChart3 :size="16" class="text-indigo-400" /><h2 class="font-semibold">Top Comparables</h2></div>
            <div class="space-y-2.5">
              <div v-for="c in comps" :key="c.addr" class="rounded-xl p-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium truncate">{{ c.addr }}</p>
                  <span class="flex items-center gap-1 text-[12px] font-semibold" :class="c.diff > 1000 ? 'text-rose-400' : 'text-emerald-400'"><ArrowUpRight :size="13" />${{ c.diff / 1000 }}k</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ currency(c.val) }} · {{ Math.round(c.sim * 100) }}% similarity</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Portfolio table -->
        <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center gap-2"><Home :size="16" class="text-sky-400" /><h2 class="font-semibold">Asset Portfolio</h2></div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-white/10">
                <th class="px-4 py-3">Address</th><th class="px-4 py-3">Area / Type</th><th class="px-4 py-3 text-right">Value</th><th class="px-4 py-3 text-right">Yield</th><th class="px-4 py-3 text-center">Status</th>
              </tr></thead>
              <tbody>
                <tr v-for="p in properties" :key="p.addr" class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td class="px-4 py-3 font-medium">{{ p.addr }}</td>
                  <td class="px-4 py-3 text-[12px] text-slate-400">{{ p.area }} · {{ p.type }}</td>
                  <td class="px-4 py-3 text-right font-semibold">{{ currency(p.value) }}</td>
                  <td class="px-4 py-3 text-right text-emerald-400">{{ p.yield }}%</td>
                  <td class="px-4 py-3 text-center"><span :class="statusTone(p.status)" class="text-[12px] capitalize">{{ p.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer class="mt-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-400">
          <span class="flex items-center gap-1.5"><Bath :size="13" /> 42-bed comp scan</span>
          <span class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-400" /> PropTech Valuator v3.1 · data fresh 2m ago</span>
        </footer>
      </main>

      <!-- Toasts -->
      <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        <div v-for="t in toasts" :key="t.id" class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-sm shadow-xl">
          <CheckCircle2 :size="16" class="text-emerald-400" />{{ t.msg }}
        </div>
      </div>
    </div>
  </div>
</template>
