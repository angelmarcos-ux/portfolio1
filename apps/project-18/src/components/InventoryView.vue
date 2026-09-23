<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Package, Boxes, TriangleAlert, CircleOff, Search, Plus, PackagePlus,
  ListFilter, DollarSign, CheckCircle2, Activity,
} from 'lucide-vue-next'
import { catalog } from '../data'
import type { CatalogItem, Notify } from '../types'

const props = defineProps<{ notify: Notify }>()

const query = ref('')
const wheel = ref('all')
const tab = ref<'all' | 'low' | 'out'>('all')

const warehouses = ['all', ...new Set(catalog.map((c) => c.warehouse))]

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return catalog.filter((c) => {
    const okTab =
      tab.value === 'all' ? true : tab.value === 'low' ? c.stock < c.min && c.stock > 0 : c.stock === 0
    const okWheel = wheel.value === 'all' || c.warehouse === wheel.value
    const okQ = !q || c.name.toLowerCase().includes(q) || c.sku.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    return okTab && okWheel && okQ
  })
})

const lowCount = computed(() => catalog.filter((c) => c.stock < c.min && c.stock > 0).length)
const outCount = computed(() => catalog.filter((c) => c.stock === 0).length)
const unitsOnHand = computed(() => catalog.reduce((s, c) => s + c.stock, 0))
const totalValue = computed(() => catalog.reduce((s, c) => s + c.stock * c.price, 0))

const status = (c: CatalogItem) =>
  c.stock === 0
    ? { label: 'Out of stock', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/20' }
    : c.stock < c.min
      ? { label: 'Low stock', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/20' }
      : { label: 'In stock', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' }
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Total SKUs</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-sky-400"><Package :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ catalog.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">active products</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Units On Hand</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><Boxes :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ unitsOnHand.toLocaleString() }}</p>
        <p class="text-[12px] text-slate-400 mt-1">across 3 warehouses</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Low stock</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><TriangleAlert :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ lowCount }}</p>
        <p class="text-[12px] text-amber-400 mt-1">below reorder point</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Out of stock</span><span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><CircleOff :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ outCount }}</p>
        <p class="text-[12px] text-slate-400 mt-1">needs restock</p>
      </div>
    </section>

    <!-- Controls -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10">
        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative">
            <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input v-model="query" type="text" placeholder="Search SKU, product, category…"
              class="w-56 md:w-64 rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-sky-500" />
          </div>
          <select v-model="wheel"
            class="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500 text-slate-300">
            <option value="all">All warehouses</option>
            <option v-for="w in warehouses.slice(1)" :key="w" :value="w">{{ w }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/10">
            <button v-for="t in ['all', 'low', 'out'] as const" :key="t" @click="tab = t"
              class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="tab === t ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-white/10'">
              {{ t }}<span v-if="t === 'all'"> ({{ catalog.length }})</span><span v-else-if="t === 'low'"> ({{ lowCount }})</span><span v-else> ({{ outCount }})</span>
            </button>
          </div>
          <button @click="notify('New SKU form opened')" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400"><Plus :size="15" /> Add item</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
            <th class="px-4 py-3">SKU</th><th class="px-4 py-3">Product</th><th class="px-4 py-3">Warehouse</th><th class="px-4 py-3 text-right">Price</th><th class="px-4 py-3">On hand / min</th><th class="px-4 py-3 text-right">Sold 7d</th><th class="px-4 py-3">Status</th><th class="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            <tr v-for="c in shown" :key="c.sku" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3 font-mono text-xs text-indigo-300">{{ c.sku }}</td>
              <td class="px-4 py-3"><p class="font-medium">{{ c.name }}</p><p class="text-[11px] text-slate-500">{{ c.category }} · {{ c.store }}</p></td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ c.warehouse }}</td>
              <td class="px-4 py-3 text-right text-slate-300">${{ c.price.toLocaleString() }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-20 h-1.5 rounded-full bg-white/10">
                    <div class="h-1.5 rounded-full" :class="c.stock === 0 ? 'bg-rose-500' : c.stock < c.min ? 'bg-amber-400' : 'bg-emerald-500'" :style="{ width: Math.min(100, (c.stock / c.min) * 100) + '%' }"></div>
                  </div>
                  <span class="text-[12px]">{{ c.stock }}<span class="text-slate-500"> / {{ c.min }}</span></span>
                </div>
              </td>
              <td class="px-4 py-3 text-right text-slate-300">{{ c.sold }}</td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border" :class="status(c).cls">{{ status(c).label }}</span></td>
              <td class="px-4 py-3 text-right">
                <button @click="notify(`Reorder queued for ${c.name}`)" :disabled="c.stock > c.min"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] disabled:opacity-30 disabled:cursor-not-allowed" :class="c.stock < c.min ? 'bg-indigo-500/15 text-sky-300 hover:bg-indigo-500/25' : 'bg-white/5 text-slate-500'">
                  <PackagePlus :size="13" /> Reorder
                </button>
              </td>
            </tr>
            <tr v-if="shown.length === 0"><td colspan="8" class="px-4 py-10 text-center text-sm text-slate-500">No products match your filters.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Value strip -->
    <section class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><DollarSign :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">On-hand value</p><p class="font-bold">${{ totalValue.toLocaleString() }}</p></div>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-sky-500/10 text-sky-400"><Activity :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">Fill rate (7d)</p><p class="font-bold">97.2%</p></div>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-violet-500/10 text-violet-400"><ListFilter :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">Auto-reorder enabled</p><p class="font-bold flex items-center gap-1.5"><CheckCircle2 :size="15" class="text-emerald-400" /> On · ≤ min stock</p></div>
      </div>
    </section>
  </div>
</template>