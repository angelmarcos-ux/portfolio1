<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calculator, Search, Plus, CheckCircle2, SlidersHorizontal, Percent, Ruler } from 'lucide-vue-next'
import { properties, currency } from '../data'
import type { Notify } from '../types'

const props = defineProps<{ notify: Notify }>()

const beds = ref(3)
const baths = ref(2)
const sqft = ref(1800)
const age = ref(12)
const address = ref('')

const base = 1180000
const contributions = computed(() => [
  { label: 'Base zone value', value: base - 1292000, note: 'Brickell-Bay adjacency' },
  { label: `Square footage (${sqft.value.toLocaleString()} sqft)`, value: sqft.value * 286, note: '$286 / sqft' },
  { label: `Property age (${age.value} yrs)`, value: -age.value * 4200, note: '-$4.2k / year' },
  { label: `Bedrooms (${beds.value})`, value: (beds.value - 3) * 98000, note: '$98k / increment' },
  { label: `Bathrooms (${baths.value})`, value: (baths.value - 2) * 64000, note: '$64k / increment' },
])
const avmValue = computed(() => base + sqft.value * 286 - age.value * 4200 + (beds.value - 3) * 98000 + (baths.value - 2) * 64000)
const confidence = computed(() => Math.max(84, Math.min(97, 93 + (beds.value === 3 ? 1 : 0) - Math.abs(sqft.value - 1800) / 200)))

const register = () => {
  if (!address.value.trim()) return props.notify('Enter an address to register the asset', false)
  properties.value.unshift({
    addr: address.value.trim(),
    area: 'New Entry',
    type: 'AVM Estimate',
    value: avmValue.value,
    yield: 51,
    status: 'offer',
    beds: beds.value,
    baths: baths.value,
    sqft: sqft.value,
  })
  props.notify(`Valuation registered for ${address.value.trim()}`)
  address.value = ''
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <!-- Inputs -->
      <section class="lg:col-span-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><Calculator :size="16" class="text-sky-400" /><h2 class="font-semibold">Automated Valuation Model</h2><span class="text-xs text-slate-400">· XGBoost v4 · 214 comps</span></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <label class="block text-[12px]"><span class="text-slate-400">Beds</span><input v-model.number="beds" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
          <label class="block text-[12px]"><span class="text-slate-400">Baths</span><input v-model.number="baths" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
          <label class="block text-[12px]"><span class="text-slate-400">Sq. Ft.</span><input v-model.number="sqft" type="number" min="0" step="50" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
          <label class="block text-[12px]"><span class="text-slate-400">Age (yrs)</span><input v-model.number="age" type="number" min="0" class="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 px-3 py-2 text-sm outline-none focus:border-sky-500" /></label>
        </div>

        <label class="block text-[12px] mb-4"><span class="text-slate-400">Asset address</span><div class="relative"><Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="address" placeholder="e.g. 1501 Bay Rd, Miami" class="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500" /></div></label>

        <div class="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 p-4 text-white flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[12px] opacity-80">Estimated Market Value</p>
            <p class="text-3xl font-extrabold">{{ currency(avmValue) }}</p>
            <p class="text-[12px] opacity-80 mt-1">Confidence {{ confidence }}% · {{ currency(Math.round(avmValue / sqft)) }}/sqft</p>
          </div>
          <button @click="register" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold"><Plus :size="15" /> Register to portfolio</button>
        </div>

        <!-- Breakdown -->
        <div class="mt-4 space-y-1.5">
          <div v-for="c in contributions" :key="c.label" class="flex items-center justify-between text-sm border-b border-slate-100 dark:border-white/5 py-2">
            <span class="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Ruler :size="13" class="text-slate-300 dark:text-slate-500" /> {{ c.label }}</span>
            <span class="flex items-center gap-2"><span :class="c.value >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'" class="font-semibold">{{ c.value >= 0 ? '+' : '−' }}{{ currency(Math.abs(c.value)) }}</span><span class="text-[11px] text-slate-400 hidden sm:inline">{{ c.note }}</span></span>
          </div>
        </div>
      </section>

      <!-- Model insights -->
      <section class="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 flex flex-col gap-3">
        <div class="flex items-center gap-2"><SlidersHorizontal :size="16" class="text-violet-400" /><h2 class="font-semibold">Model Insights</h2></div>
        <div class="rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-3.5">
          <p class="text-[12px] text-slate-400">Price / sqft</p>
          <p class="text-xl font-bold">{{ currency(Math.round(avmValue / sqft)) }}</p>
        </div>
        <div class="rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-3.5">
          <p class="text-[12px] text-slate-400">RMS error (train)</p>
          <p class="text-xl font-bold">±3.8%</p>
        </div>
        <div class="rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-3.5">
          <p class="text-[12px] text-slate-400 flex items-center gap-1.5"><Percent :size="12" /> Sale / list ratio</p>
          <p class="text-xl font-bold">97.6%</p>
        </div>
        <div class="rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-3.5">
          <p class="text-[12px] text-slate-400 flex items-center gap-1.5"><CheckCircle2 :size="12" class="text-emerald-400" /> Quality grade</p>
          <p class="text-xl font-bold">Investment Grade</p>
        </div>
        <button @click="notify('AVM re-indexed against 214 comparables · confidence 93%')" class="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 text-sm font-medium hover:bg-sky-500/25">Run full re-index</button>
      </section>
    </div>
  </div>
</template>