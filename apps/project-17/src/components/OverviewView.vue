<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Store, Boxes, CheckCircle2, TriangleAlert, TrendingUp,
  CalendarDays, PieChart, PackagePlus, ShoppingCart, RefreshCw, Box, Warehouse,
} from 'lucide-vue-next'
import { catalog, warehouses } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const lowStock = computed(() => catalog.filter((r) => r.stock < r.min))
const inventoryValue = 2_840_000
const fillRate = 97.2

const activeFilter = ref<'all' | 'low' | 'out'>('low')
const filtered = computed(() =>
  activeFilter.value === 'all'
    ? catalog
    : activeFilter.value === 'low'
      ? lowStock.value
      : catalog.filter((r) => r.stock === 0),
)

const channelShare = [
  { name: 'In-Store POS', pct: 46, color: '#6366f1' },
  { name: 'E-com', pct: 34, color: '#22d3ee' },
  { name: 'Marketplace', pct: 13, color: '#a78bfa' },
  { name: 'Wholesale', pct: 7, color: '#fb7185' },
]
</script>

<template>
  <div>
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
              class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="activeFilter === f ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
              {{ f }}<span v-if="f === 'low'"> ({{ lowStock.length }})</span><span v-else-if="f === 'out'"> ({{ catalog.filter(r => r.stock === 0).length }})</span>
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
                <td class="px-4 py-3 text-right"><button @click="notify(`Reorder queued for ${r.name}`)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 text-sky-300 text-[12px] hover:bg-indigo-500/25"><PackagePlus :size="13" /> Reorder</button></td>
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
        <button @click="notify('Auto-reorder created for all low-stock SKUs')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-[12px] hover:bg-emerald-500/25"><RefreshCw :size="13" /> Auto-restock all</button>
        <span class="hidden sm:inline">RetailOps v2.4 · <Store :size="12" class="inline" /> 6 stores</span>
      </div>
    </footer>
    <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarDays :size="12" /> Data synced 2 min ago</p>
  </div>
</template>