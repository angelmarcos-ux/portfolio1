<script setup lang="ts">
import { computed } from 'vue'
import { MapPinned, Navigation, Flame, ScanSearch, Layers, Compass, ArrowUpRight } from 'lucide-vue-next'
import { marketAreas } from '../data'
import { currency } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const avg = computed(() => Math.round(marketAreas.reduce((n, a) => n + a.avgPrice, 0) / marketAreas.length))
const hottest = computed(() => [...marketAreas].sort((a, b) => b.heat - a.heat)[0])
const hottest2 = computed(() => [...marketAreas].sort((a, b) => b.heat - a.heat)[1])

const heatBg = (heat: number) =>
  heat >= 85 ? 'from-rose-500/20 to-orange-500/10 border-rose-500/30' : heat >= 70 ? 'from-amber-500/15 to-orange-500/5 border-amber-500/25' : heat >= 55 ? 'from-sky-500/15 to-indigo-500/5 border-sky-500/25' : 'from-slate-400/10 to-slate-500/5 border-slate-400/20'
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Coverage</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><MapPinned :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">6 submarkets</p>
        <p class="text-[12px] text-slate-400 mt-1">Great Miami SMA</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Avg $ / Sq Ft</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Compass :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ currency(avg) }}</p>
        <p class="text-[12px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight :size="13" /> +9.1% YoY</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Hottest Belt</span><span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><Flame :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ hottest.name }}</p>
        <p class="text-[12px] text-rose-400 mt-1">heat {{ hottest.heat }}/100</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Runner-up</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Navigation :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ hottest2.name }}</p>
        <p class="text-[12px] text-slate-400 mt-1">heat {{ hottest2.heat }}/100</p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <!-- Map -->
      <section class="lg:col-span-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><MapPinned :size="16" class="text-sky-400" /><h2 class="font-semibold">Heat Map · Greater Miami</h2><span class="text-xs text-slate-400">· demand overlay</span></div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button v-for="a in marketAreas" :key="a.name" @click="notify(`${a.name} market scanned · ${a.count} active listings · avg ${currency(a.avgPrice)}/sqft`)"
            class="group rounded-xl p-4 text-left bg-gradient-to-br border transition-transform hover:-translate-y-0.5" :class="heatBg(a.heat)">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-700 dark:text-slate-200">{{ a.name }}</p>
              <span class="w-2.5 h-2.5 rounded-full" :class="a.heat >= 85 ? 'bg-rose-400' : a.heat >= 70 ? 'bg-amber-400' : a.heat >= 55 ? 'bg-sky-400' : 'bg-slate-400'"></span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{{ a.count }} comps · {{ currency(a.avgPrice) }} / sqft</p>
            <div class="h-1.5 rounded-full bg-black/10 dark:bg-white/10 mt-3"><div class="h-1.5 rounded-full" :class="a.heat >= 85 ? 'bg-rose-400' : a.heat >= 70 ? 'bg-amber-400' : a.heat >= 55 ? 'bg-sky-400' : 'bg-slate-400'" :style="{ width: a.heat + '%' }"></div></div>
          </button>
        </div>

        <div class="mt-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span class="flex items-center gap-3">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Hot</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Warm</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Stable</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Cooling</span>
          </span>
          <span>Updated 12 min ago</span>
        </div>
      </section>

      <!-- Ranking -->
      <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><Layers :size="16" class="text-indigo-400" /><h2 class="font-semibold">Submarket Ranking</h2></div>
        <div class="space-y-2.5">
          <div v-for="(a, i) in [...marketAreas].sort((x, y) => y.heat - x.heat)" :key="a.name" class="flex items-center gap-3">
            <span class="w-6 text-center text-[12px] font-bold text-slate-400">{{ i + 1 }}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between text-sm mb-1"><span class="text-slate-700 dark:text-slate-200">{{ a.name }}</span><span class="text-[11px] text-slate-400">{{ a.heat }} heat</span></div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-white/10"><div class="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" :style="{ width: a.heat + '%' }"></div></div>
            </div>
          </div>
        </div>
        <button @click="notify('Full county scan queued · 2,140 parcel records')" class="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 text-sm font-medium hover:bg-sky-500/25"><ScanSearch :size="15" /> Scan everything</button>
      </section>
    </div>
  </div>
</template>