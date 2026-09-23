<script setup lang="ts">
import { ref, computed } from 'vue'
import { BarChart3, Search, ArrowUpDown, Trophy, CheckCircle2, ArrowUpRight } from 'lucide-vue-next'
import { comparables, currency } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

type Tab = 'all' | 'Sold' | 'Pending' | 'Active'
const tab = ref<Tab>('all')
const query = ref('')
const sortKey = ref<'sim' | 'psf' | 'price'>('sim')
const asc = ref(false)

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = comparables.filter((c) => {
    const okTab = tab.value === 'all' || c.status === tab.value
    const okQ = !q || c.addr.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    return okTab && okQ
  })
  const mult = asc.value ? 1 : -1
  return [...list].sort((a, b) => (a[sortKey.value] - b[sortKey.value]) * mult)
})

const sort = (k: 'sim' | 'psf' | 'price') => {
  if (sortKey.value === k) asc.value = !asc.value
  else { sortKey.value = k; asc.value = false }
}
const countFor = (t: Tab) => (t === 'all' ? comparables.length : comparables.filter((c) => c.status === t).length)

const statusTone: Record<string, string> = {
  Sold: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
  Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20',
  Active: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/20',
}
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Comparables</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><BarChart3 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ comparables.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">214 in training set</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Median $ / SqFt</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><ArrowUpDown :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ currency(Math.round(comparables.reduce((n, c) => n + c.psf, 0) / comparables.length)) }}</p>
        <p class="text-[12px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight :size="13" /> +5.4% MoM</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Top Similarity</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Trophy :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ Math.round(comparables[0].sim * 100) }}%</p>
        <p class="text-[12px] text-slate-400 mt-1">{{ comparables[0].addr }}</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Quality Check</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">Clean</p>
        <p class="text-[12px] text-slate-400 mt-1">no outlier flags</p>
      </div>
    </section>

    <!-- Comparables table -->
    <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-2"><BarChart3 :size="16" class="text-sky-400" /><h2 class="font-semibold">Comparable Sales</h2></div>
        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="query" type="text" placeholder="Search comps…"
              class="w-44 md:w-56 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500" />
          </div>
          <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
            <button v-for="t in ['all', 'Sold', 'Pending', 'Active'] as const" :key="t" @click="tab = t"
              class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="tab === t ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-white dark:hover:bg-white/10'">
              {{ t }} ({{ countFor(t) }})
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-white/10">
            <th class="px-4 py-3">Address</th><th class="px-4 py-3">Area / Type</th>
            <th class="px-4 py-3 text-right cursor-pointer select-none hover:text-sky-500" @click="sort('price')">Price <ArrowUpDown :size="11" class="inline" /></th>
            <th class="px-4 py-3 text-right cursor-pointer select-none hover:text-sky-500" @click="sort('psf')">$ / SqFt <ArrowUpDown :size="11" class="inline" /></th>
            <th class="px-4 py-3">Similarity</th><th class="px-4 py-3">Status</th>
          </tr></thead>
          <tbody>
            <tr v-for="c in shown" :key="c.addr" class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
              <td class="px-4 py-3 font-medium">{{ c.addr }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ c.area }} · {{ c.type }} · {{ c.beds }}/{{ c.baths }}</td>
              <td class="px-4 py-3 text-right font-semibold">{{ currency(c.price) }}</td>
              <td class="px-4 py-3 text-right text-slate-500 dark:text-slate-400">${{ c.psf.toLocaleString() }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-white/10"><div class="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" :style="{ width: c.sim * 100 + '%' }"></div></div>
                  <span class="text-[12px] text-slate-500 dark:text-slate-400">{{ Math.round(c.sim * 100) }}%</span>
                </div>
              </td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border" :class="statusTone[c.status]">{{ c.status }}</span></td>
            </tr>
            <tr v-if="shown.length === 0"><td colspan="6" class="px-4 py-10 text-center text-sm text-slate-400">No comparables match your filters.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>