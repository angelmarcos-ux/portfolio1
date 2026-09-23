<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Truck, Plane, Ship, Route, MapPin, Clock3, RefreshCw, CheckCircle2,
  TrendingUp, PackageCheck, CircleDot,
} from 'lucide-vue-next'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

type Mode = 'truck' | 'air' | 'sea'
interface Shipment {
  id: string
  origin: string
  destination: string
  carrier: string
  mode: Mode
  status: 'in-transit' | 'out-for-delivery' | 'delivered' | 'delayed'
  eta: string
  progress: number
  items: number
}

const shipments = ref<Shipment[]>([
  { id: 'XA-1181-A', origin: 'Miami DC', destination: 'Sunset Store', carrier: 'SwiftLine Freight', mode: 'truck', status: 'out-for-delivery', eta: 'Today, 14:00', progress: 88, items: 640 },
  { id: 'XA-1180-A', origin: 'Orlando Hub', destination: 'Coconut Grove', carrier: 'SwiftLine Freight', mode: 'truck', status: 'in-transit', eta: 'Today, 16:30', progress: 62, items: 412 },
  { id: 'XA-1179-A', origin: 'Jacksonville Port', destination: 'Miami DC', carrier: 'Atlantic Cargo', mode: 'sea', status: 'in-transit', eta: 'Sep 25, 09:00', progress: 45, items: 2860 },
  { id: 'XA-1178-A', origin: 'Chicago Airtie', destination: 'Tampa Spoke', carrier: 'SkyCourier', mode: 'air', status: 'in-transit', eta: 'Sep 24, 22:15', progress: 71, items: 118 },
  { id: 'XA-1177-A', origin: 'Tampa Spoke', destination: 'South Beach', carrier: 'Harbor Express', mode: 'truck', status: 'delivered', eta: 'Today, 11:20', progress: 100, items: 96 },
  { id: 'XA-1176-B', origin: 'Guangzhou Port', destination: 'Miami DC', carrier: 'PacificLine', mode: 'sea', status: 'delayed', eta: 'Sep 29, 08:00', progress: 22, items: 5240 },
])

const tabs = ['all', 'in-transit', 'out-for-delivery', 'delivered', 'delayed'] as const
type Tab = (typeof tabs)[number]
const tab = ref<Tab>('all')
const shown = computed(() => (tab.value === 'all' ? shipments.value : shipments.value.filter((s) => s.status === tab.value)))

const inTransit = computed(() => shipments.value.filter((s) => ['in-transit', 'out-for-delivery'].includes(s.status)).length)

const modeIcon = (m: Mode) => (m === 'air' ? Plane : m === 'sea' ? Ship : Truck)

const statusStyle: Record<string, string> = {
  'in-transit': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  'out-for-delivery': 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  delayed: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
}
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">In Transit</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Truck :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ inTransit }}</p>
        <p class="text-[12px] text-slate-400 mt-1">shipments moving now</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Out for Delivery</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><CircleDot :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ shipments.filter((s) => s.status === 'out-for-delivery').length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">last-mile fleet</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Delivered Today</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><PackageCheck :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">142</p>
        <p class="text-[12px] text-slate-400 mt-1">across 4 routes</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">On-Time Rate</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingUp :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">96.8%</p>
        <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> +1.1pt vs last week</p>
      </div>
    </section>

    <!-- Live shipments -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10">
        <div class="flex items-center gap-2"><Route :size="16" class="text-sky-400" /><h2 class="font-semibold">Live Shipments</h2><span class="text-xs text-slate-400">· {{ shipments.length }} tracked</span></div>
        <div class="flex items-center gap-1.5">
          <button v-for="t in tabs" :key="t" @click="tab = t"
            class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="tab === t ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'">{{ t }}</button>
          <button @click="notify('Shipment feeds synced with carriers')" class="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-300 hover:bg-white/10"><RefreshCw :size="12" /> Sync</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
            <th class="px-4 py-3">Tracking</th><th class="px-4 py-3">Route</th><th class="px-4 py-3">Carrier</th><th class="px-4 py-3">Mode</th><th class="px-4 py-3">Progress</th><th class="px-4 py-3">ETA</th><th class="px-4 py-3">Status</th>
          </tr></thead>
          <tbody>
            <tr v-for="s in shown" :key="s.id" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3 font-mono text-xs text-sky-300">{{ s.id }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2 text-[12px]">
                  <span class="flex items-center gap-1 text-slate-300"><MapPin :size="12" class="text-sky-400" /> {{ s.origin }}</span>
                  <span class="text-slate-500 text-xs">→</span>
                  <span class="text-slate-300">{{ s.destination }}</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ s.items.toLocaleString() }} units</p>
              </td>
              <td class="px-4 py-3 text-[12px] text-slate-300">{{ s.carrier }}</td>
              <td class="px-4 py-3"><span class="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 inline-flex"><component :is="modeIcon(s.mode)" :size="15" /></span></td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2 min-w-24">
                  <div class="flex-1 h-1.5 rounded-full bg-white/10">
                    <div class="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" :style="{ width: s.progress + '%' }"></div>
                  </div>
                  <span class="text-[11px] text-slate-400">{{ s.progress }}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-[12px] text-slate-400 flex items-center gap-1.5"><Clock3 :size="12" /> {{ s.eta }}</td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border capitalize" :class="statusStyle[s.status]">{{ s.status.replace('-', ' ') }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Selected shipment timeline -->
    <section class="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
      <div class="flex items-center gap-2 mb-4"><PackageCheck :size="16" class="text-emerald-400" /><h2 class="font-semibold">Tracking Timeline</h2><span class="text-xs text-slate-400">· XA-1181-A · Sunrise Store run</span></div>
      <ol class="relative border-l border-white/10 ml-2 space-y-5">
        <li class="ml-5">
          <span class="absolute -left-[7px] mt-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></span>
          <p class="text-sm font-medium text-slate-200 text-left flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Delivered</p>
          <p class="text-[12px] text-slate-500 mt-0.5">Parcel reached Sunset Store dock · signed by J. Alvarez · Today 13:52</p>
        </li>
        <li class="ml-5">
          <span class="absolute -left-[7px] mt-0.5 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-sky-500/20"></span>
          <p class="text-sm font-medium text-slate-200 text-left">Out for delivery</p>
          <p class="text-[12px] text-slate-500 mt-0.5">Loaded on route 4 van · 96 Dock configured · Today 08:10</p>
        </li>
        <li class="ml-5">
          <span class="absolute -left-[7px] mt-0.5 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20"></span>
          <p class="text-sm font-medium text-slate-200 text-left">Departed Miami DC</p>
          <p class="text-[12px] text-slate-500 mt-0.5">Palletized · 640 units · sealed · Yesterday 21:45</p>
        </li>
        <li class="ml-5">
          <span class="absolute -left-[7px] mt-0.5 w-3 h-3 rounded-full bg-white/30 ring-4 ring-white/5"></span>
          <p class="text-sm font-medium text-slate-400 text-left">Picked & packed</p>
          <p class="text-[12px] text-slate-600 mt-0.5">Ready for dispatch · Yesterday 18:02</p>
        </li>
      </ol>
    </section>
  </div>
</template>