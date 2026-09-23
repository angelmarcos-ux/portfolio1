<script setup lang="ts">
import { computed } from 'vue'
import { LandPlot, TreePine, Landmark, Sprout, Plus, MapPinned, ListFilter } from 'lucide-vue-next'
import { parcels, currency } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const totalAcres = computed(() => parcels.reduce((n, p) => n + p.acres, 0))
const totalValue = computed(() => parcels.reduce((n, p) => n + p.value, 0))
const held = computed(() => parcels.filter((p) => p.status === 'Held').length)

const zoningTone: Record<string, string> = {
  'Mixed-Use': 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/20',
  Industrial: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20',
  Residential: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
  Retail: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/20',
}
const statusTone: Record<string, string> = {
  Held: 'text-emerald-500 dark:text-emerald-400',
  'Under Option': 'text-sky-500 dark:text-sky-400',
  'Under Offer': 'text-amber-500 dark:text-amber-400',
}
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Parcels Held</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><LandPlot :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ parcels.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">{{ held }} long-term holds</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Total Acres</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><TreePine :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ totalAcres.toFixed(1) }}</p>
        <p class="text-[12px] text-slate-400 mt-1">under control</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Land Value</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Landmark :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ currency(totalValue) }}</p>
        <p class="text-[12px] text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1">+11.2% appraised</p>
      </div>
      <div class="rounded-2xl p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Avg $ / Acre</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><Sprout :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ currency(Math.round(totalValue / totalAcres)) }}</p>
        <p class="text-[12px] text-slate-400 mt-1">across zoning types</p>
      </div>
    </section>

    <!-- Parcel cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <section v-for="p in parcels" :key="p.id" class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white"><MapPinned :size="17" /></div>
            <div><p class="font-semibold leading-tight">{{ p.name }}</p><p class="text-[11px] text-slate-400">{{ p.id }} · {{ p.area }}</p></div>
          </div>
          <span class="text-[12px] font-medium capitalize" :class="statusTone[p.status]">{{ p.status }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">{{ p.acres }} acres</span>
          <span class="font-semibold">{{ currency(p.value) }}</span>
        </div>
        <div class="rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-3 py-2 text-[12px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span class="font-medium" :class="zoningTone[p.zoning] || 'text-slate-400'">{{ p.zoning }}</span>
          <span>{{ currency(p.pricePerAcre) }} / acre</span>
        </div>
        <div class="mt-auto pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[12px]">
          <span class="text-emerald-500 dark:text-emerald-400">{{ p.yield }}% proj. yield</span>
          <button @click="notify(`${p.name} opened in due-diligence workspace`)" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15">Review</button>
        </div>
      </section>

      <!-- Add parcel -->
      <button @click="notify('New parcel intake form opened')"
        class="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 min-h-[200px] flex flex-col items-center justify-center gap-2 text-slate-400">
        <span class="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"><Plus :size="20" /></span>
        <span class="text-sm font-medium">Add parcel</span>
        <span class="text-[11px]">Upload survey + zoning record</span>
      </button>
    </div>

    <!-- Zoning mix -->
    <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
      <div class="flex items-center gap-2 mb-4"><ListFilter :size="16" class="text-emerald-400" /><h2 class="font-semibold">Zoning Mix by Value</h2></div>
      <div class="space-y-3">
        <div v-for="z in ['Mixed-Use', 'Industrial', 'Residential', 'Retail']" :key="z">
          <div class="flex items-center justify-between text-[12px] mb-1">
            <span class="text-slate-500 dark:text-slate-400">{{ z }}</span>
            <span class="text-slate-400">{{ currency(parcels.filter((p) => p.zoning === z).reduce((n, p) => n + p.value, 0)) }}</span>
          </div>
          <div class="h-2.5 rounded-full bg-slate-100 dark:bg-white/10">
            <div class="h-2.5 rounded-full" :style="{ width: (parcels.filter((p) => p.zoning === z).reduce((n, p) => n + p.value, 0) / totalValue) * 100 + '%' }"
              :class="z === 'Mixed-Use' ? 'bg-violet-400' : z === 'Industrial' ? 'bg-amber-400' : z === 'Residential' ? 'bg-emerald-400' : 'bg-sky-400'"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>