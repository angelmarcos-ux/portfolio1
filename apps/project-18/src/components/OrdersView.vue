<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ShoppingCart, Search, Plus, CalendarDays, PackageCheck,
  CircleDollarSign, Clock3, CheckCircle2, ArrowUpRight, Copy,
} from 'lucide-vue-next'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

type OrderStatus = 'pending' | 'processing' | 'processed' | 'shipped' | 'delivered' | 'cancelled'
interface Order {
  id: string
  customer: string
  store: string
  items: number
  total: number
  date: string
  status: OrderStatus
  progress: number
}

const orders = ref<Order[]>([
  { id: 'HX-10482', customer: 'Marlin Surf Co.', store: 'Downtown', items: 3, total: 1248, date: 'Today, 09:32', status: 'processing', progress: 40 },
  { id: 'HX-10481', customer: 'Ánimo Retail Group', store: 'South Beach', items: 2, total: 876, date: 'Today, 08:15', status: 'pending', progress: 10 },
  { id: 'HX-10480', customer: 'Biscayne Supply', store: 'Coconut Grove', items: 6, total: 3412, date: 'Yesterday, 17:48', status: 'shipped', progress: 65 },
  { id: 'HX-10479', customer: 'Palmetto Outdoor', store: 'Sunset', items: 1, total: 849, date: 'Yesterday, 14:02', status: 'processed', progress: 30 },
  { id: 'HX-10478', customer: 'Key West Trading', store: 'Downtown', items: 4, total: 2104, date: 'Yesterday, 11:26', status: 'delivered', progress: 100 },
  { id: 'HX-10477', customer: 'Grove Market Co.', store: 'Coconut Grove', items: 2, total: 468, date: 'Sep 21, 16:09', status: 'delivered', progress: 100 },
  { id: 'HX-10476', customer: 'Miami Beach Club', store: 'South Beach', items: 5, total: 1893, date: 'Sep 21, 10:44', status: 'cancelled', progress: 0 },
  { id: 'HX-10475', customer: 'Everglades Outfitters', store: 'Sunset', items: 3, total: 657, date: 'Sep 20, 15:30', status: 'shipped', progress: 80 },
])

type Tab = 'all' | 'pending' | 'shipped' | 'delivered'
const tab = ref<Tab>('all')
const query = ref('')

const statusStyle: Record<string, string> = {
  pending: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  processing: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  shipped: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
}

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    const okTab = tab.value === 'all' ? true : o.status === tab.value || (tab.value === 'pending' && (o.status === 'pending' || o.status === 'processing'))
    const okQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    return okTab && okQ
  })
})

const openOrders = computed(() => orders.value.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length)
const awaitingShipment = computed(() => orders.value.filter((o) => ['pending', 'processing'].includes(o.status)).length)
const dollars = computed(() => orders.value.filter((o) => o.status === 'delivered').length)

const countFor = (t: Tab) =>
  t === 'all' ? orders.value.length : t === 'pending' ? orders.value.filter((o) => ['pending', 'processing'].includes(o.status)).length : orders.value.filter((o) => o.status === t).length
</script>

<template>
  <div>
    <!-- Stat chips -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Open Orders</span><span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><ShoppingCart :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ openOrders }}</p>
        <p class="text-[12px] text-slate-400 mt-1">in the pipeline</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Awaiting Shipment</span><span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Clock3 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ awaitingShipment }}</p>
        <p class="text-[12px] text-slate-400 mt-1">28 to fulfill today</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Delivered Today</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ dollars }}</p>
        <p class="text-[12px] text-slate-400 mt-1">96% on-time</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Order Value</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><CircleDollarSign :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">$12,507</p>
        <p class="text-[12px] text-slate-400 mt-1">last 7 days</p>
      </div>
    </section>

    <!-- Orders table -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10">
        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative">
            <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input v-model="query" type="text" placeholder="Search order or customer…"
              class="w-56 md:w-64 rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-sky-500" />
          </div>
          <div class="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/10">
            <button v-for="t in ['all', 'pending', 'shipped', 'delivered'] as const" :key="t" @click="tab = t"
              class="px-3 py-1.5 rounded-lg text-[12px] capitalize" :class="tab === t ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-white/10'">
              {{ t }} ({{ countFor(t) }})
            </button>
          </div>
        </div>
        <button @click="notify('New purchase order form opened')" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400"><Plus :size="15" /> New order</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
            <th class="px-4 py-3">Order</th><th class="px-4 py-3">Customer</th><th class="px-4 py-3">Store</th><th class="px-4 py-3 text-right">Items</th><th class="px-4 py-3 text-right">Total</th><th class="px-4 py-3">Fulfillment</th><th class="px-4 py-3">Status</th><th class="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            <tr v-for="o in shown" :key="o.id" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <p class="font-mono text-xs text-sky-300">{{ o.id }}</p>
                <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><CalendarDays :size="11" /> {{ o.date }}</p>
              </td>
              <td class="px-4 py-3 font-medium">{{ o.customer }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ o.store }}</td>
              <td class="px-4 py-3 text-right text-slate-300">{{ o.items }}</td>
              <td class="px-4 py-3 text-right font-medium">${{ o.total.toLocaleString() }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2 min-w-28">
                  <div class="flex-1 h-1.5 rounded-full bg-white/10">
                    <div class="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-400" :style="{ width: o.progress + '%' }"></div>
                  </div>
                  <span class="text-[11px] text-slate-400">{{ o.progress }}%</span>
                </div>
              </td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border capitalize" :class="statusStyle[o.status]">{{ o.status }}</span></td>
              <td class="px-4 py-3 text-right">
                <button @click="notify(`Order ${o.id} — ${o.customer}`)" class="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-sky-300"><ArrowUpRight :size="15" /></button>
                <button @click="notify(`Order ID ${o.id} copied`)" class="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-sky-300"><Copy :size="14" /></button>
              </td>
            </tr>
            <tr v-if="shown.length === 0"><td colspan="8" class="px-4 py-10 text-center text-sm text-slate-500">No orders match your filters.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Shipment pipeline strip -->
    <section class="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
      <div class="flex items-center gap-2 mb-4"><PackageCheck :size="16" class="text-emerald-400" /><h2 class="font-semibold">Order Fulfillment Pipeline</h2></div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
        <div class="rounded-xl bg-black/20 border border-white/10 py-4"><p class="text-2xl font-bold text-slate-200">24</p><p class="text-[11px] text-slate-400">Placed</p></div>
        <div class="rounded-xl bg-black/20 border border-white/10 py-4"><p class="text-2xl font-bold text-sky-300">18</p><p class="text-[11px] text-slate-400">Picking</p></div>
        <div class="rounded-xl bg-black/20 border border-white/10 py-4"><p class="text-2xl font-bold text-indigo-300">11</p><p class="text-[11px] text-slate-400">Packed</p></div>
        <div class="rounded-xl bg-black/20 border border-white/10 py-4"><p class="text-2xl font-bold text-amber-300">13</p><p class="text-[11px] text-slate-400">In Transit</p></div>
        <div class="rounded-xl bg-black/20 border border-white/10 py-4"><p class="text-2xl font-bold text-emerald-300">28</p><p class="text-[11px] text-slate-400">Delivered</p></div>
      </div>
    </section>
  </div>
</template>