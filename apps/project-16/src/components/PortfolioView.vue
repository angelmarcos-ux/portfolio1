<script setup lang="ts">
import { computed, ref } from 'vue'
import { TrendingUp, Key, Gauge, Coins, LandPlot, Home, CheckCircle2, Bath, FolderOpen } from 'lucide-vue-next'
import { properties, currency } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const inventoryValue = computed(() =>
  properties.value.filter((p) => p.status === 'live' || p.status === 'offer').reduce((n, p) => n + p.value, 0),
)
const yieldAvg = computed(() => (properties.value.reduce((n, p) => n + p.yield, 0) / properties.value.length).toFixed(2))
const active = computed(() => properties.value.filter((p) => p.status !== 'closed').length)

type Tab = 'all' | 'live' | 'offer' | 'closed'
const tab = ref<Tab>('all')
const shown = computed(() => (tab.value === 'all' ? properties.value : properties.value.filter((p) => p.status === tab.value)))

const statusTone = (s: string) => (s === 'live' ? 'text-emerald-500 dark:text-emerald-400' : s === 'offer' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400')
</script>

<template>
  <div>
    <!-- Stat cards -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Portfolio Value</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><Coins :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ currency(inventoryValue) }}</p>
        <p class="text-[12px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +6.4% QoQ</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Active Assets</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Key :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ active }}</p>
        <p class="text-[12px] text-slate-400 mt-1">{{ properties.length }} total tracked</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Avg Gross Yield</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Gauge :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ yieldAvg }}%</p>
        <p class="text-[12px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +0.8pt</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Pipeline Offers</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><LandPlot :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ properties.filter((p) => p.status === 'offer').length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">awaiting sellers</p>
      </div>
    </section>

    <!-- Portfolio table -->
    <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-2"><Home :size="16" class="text-sky-400" /><h2 class="font-semibold">Asset Portfolio</h2></div>
        <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
          <button v-for="t in ['all', 'live', 'offer', 'closed'] as const" :key="t" @click="tab = t"
            class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="tab === t ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-white dark:hover:bg-white/10'">
            {{ t }} ({{ properties.filter((p) => t === 'all' || p.status === t).length }})
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-white/10">
            <th class="px-4 py-3">Address</th><th class="px-4 py-3">Area / Type</th><th class="px-4 py-3 text-right">Value</th><th class="px-4 py-3 text-right">Yield</th><th class="px-4 py-3 text-center">Status</th>
          </tr></thead>
          <tbody>
            <tr v-for="p in shown" :key="p.addr" class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
              <td class="px-4 py-3 font-medium">{{ p.addr }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ p.area }} · {{ p.type }}</td>
              <td class="px-4 py-3 text-right font-semibold">{{ currency(p.value) }}</td>
              <td class="px-4 py-3 text-right text-emerald-500 dark:text-emerald-400">{{ p.yield }}%</td>
              <td class="px-4 py-3 text-center"><span :class="statusTone(p.status)" class="text-[12px] capitalize">{{ p.status }}</span></td>
            </tr>
            <tr v-if="shown.length === 0"><td colspan="5" class="px-4 py-10 text-center text-sm text-slate-400">No assets in this state.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Deployment summary -->
    <section class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-sky-500/10 text-sky-400"><FolderOpen :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">Capital Deployed</p><p class="font-bold">$9.7M</p></div>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle2 :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">Closing Rate</p><p class="font-bold">83%</p></div>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
        <span class="p-2.5 rounded-xl bg-violet-500/10 text-violet-400"><Bath :size="18" /></span>
        <div><p class="text-[12px] text-slate-400">Comps Scanned</p><p class="font-bold">214 units</p></div>
      </div>
    </section>
  </div>
</template>