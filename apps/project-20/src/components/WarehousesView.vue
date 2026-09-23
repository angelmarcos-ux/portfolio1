<script setup lang="ts">
import { computed } from 'vue'
import { Warehouse, Plus, Ruler, Boxes, Radar, MapPin, DoorOpen, Layers } from 'lucide-vue-next'
import { warehouses } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const totalSqft = computed(() => warehouses.reduce((s, w) => s + w.sqft, 0))
const totalSkus = computed(() => warehouses.reduce((s, w) => s + w.skus, 0))
const avgLoad = computed(() => Math.round(warehouses.reduce((s, w) => s + w.load, 0) / warehouses.length))

const tone = (load: number) =>
  load <= 55 ? 'text-sky-400 bg-sky-500/10' : load <= 75 ? 'text-amber-300 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Facilities</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-sky-400"><Warehouse :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ warehouses.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">3 active · 1 planned</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Total Space</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><Ruler :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ (totalSqft / 1000).toFixed(0) }}k</p>
        <p class="text-[12px] text-slate-400 mt-1">sq ft across network</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">SKUs Stored</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Boxes :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ totalSkus.toLocaleString() }}</p>
        <p class="text-[12px] text-slate-400 mt-1">handled this period</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Avg Load</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Radar :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ avgLoad }}%</p>
        <p class="text-[12px] text-slate-400 mt-1">optimized target 70%</p>
      </div>
    </section>

    <!-- Facility cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <section v-for="w in warehouses" :key="w.name" class="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white"><Warehouse :size="20" /></div>
            <div><p class="font-bold leading-tight">{{ w.name }}</p><p class="text-[11px] text-slate-400 flex items-center gap-1"><MapPin :size="11" /> {{ w.city }}</p></div>
          </div>
          <span class="text-[11px] px-2 py-0.5 rounded-full border border-white/10 text-slate-300">{{ w.role }}</span>
        </div>

        <div>
          <div class="flex items-center justify-between text-[12px] mb-1.5"><span class="text-slate-400">Utilization</span><span :class="['px-1.5 py-0.5 rounded text-[11px] font-medium', tone(w.load)]">{{ w.load }}%</span></div>
          <div class="h-2.5 rounded-full bg-white/10">
            <div class="h-2.5 rounded-full" :class="w.load <= 55 ? 'bg-gradient-to-r from-sky-500 to-indigo-400' : w.load <= 75 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-400'" :style="{ width: w.load + '%' }"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[12px]">
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2"><p class="text-slate-500 flex items-center gap-1.5"><DoorOpen :size="12" /> Dock doors</p><p class="font-semibold mt-0.5">{{ w.open }} / {{ w.doors }} open</p></div>
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2"><p class="text-slate-500 flex items-center gap-1.5"><Boxes :size="12" /> SKUs</p><p class="font-semibold mt-0.5">{{ w.skus.toLocaleString() }}</p></div>
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2 col-span-2"><p class="text-slate-500 flex items-center gap-1.5"><Layers :size="12" /> Zones</p><p class="font-semibold mt-0.5">{{ w.zones }}</p></div>
        </div>

        <div class="mt-auto flex items-center justify-between pt-3 border-t border-white/10 text-[12px]">
          <span class="text-slate-500">Synced {{ w.sync }}</span>
          <button @click="notify(`Opening ${w.name} detail view`)" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10">Manage</button>
        </div>
      </section>

      <!-- Add facility card -->
      <button @click="notify('New warehouse onboarding flow started')"
        class="rounded-2xl border-2 border-dashed border-white/10 hover:border-sky-500/40 hover:bg-sky-500/5 min-h-[240px] flex flex-col items-center justify-center gap-2 text-slate-500">
        <span class="p-3 rounded-xl bg-white/5 border border-white/10"><Plus :size="20" /></span>
        <span class="text-sm font-medium">Add warehouse</span>
        <span class="text-[11px]">Expansion planning for Q3</span>
      </button>
    </div>

    <!-- Capacity comparison -->
    <section class="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div class="flex items-center gap-2 mb-4"><Radar :size="16" class="text-sky-400" /><h2 class="font-semibold">Capacity Comparison</h2></div>
      <div class="space-y-4">
        <div v-for="w in warehouses" :key="w.name">
          <div class="flex items-center justify-between text-[12px] mb-1"><span class="text-slate-300">{{ w.name }}</span><span class="text-slate-400">{{ Math.round(w.sqft * (w.load / 100) / 1000) }}k / {{ Math.round(w.sqft / 1000) }}k sq ft used</span></div>
          <div class="h-4 rounded-full bg-white/10 overflow-hidden">
            <div class="h-4 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-violet-400" :style="{ width: w.load + '%' }"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>