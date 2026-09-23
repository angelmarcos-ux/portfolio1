<script setup lang="ts">
import { ref } from 'vue'
import {
  Save, Globe, Bell, PlugZap, Webhook, Store, Trash2,
  ShieldCheck, KeyRound, RefreshCw, SunMedium, MoonStar, Building2,
} from 'lucide-vue-next'
import type { Notify } from '../types'

const props = defineProps<{ notify: Notify; theme: 'dark' | 'light' }>()

const workspace = ref({ name: 'RetailOps', email: 'ops@retailops.app', timezone: 'America/New_York' })

const toggles = ref([
  { key: 'low', label: 'Low-stock alerts', desc: 'Notify ops when a SKU drops below its reorder point', on: true },
  { key: 'digest', label: 'Daily inventory digest', desc: 'Morning email summary of stock, orders and shipments', on: true },
  { key: 'order', label: 'Order status updates', desc: 'Real-time notifications for fulfillment changes', on: false },
  { key: 'logistics', label: 'Logistics exceptions', desc: 'Immediate alerts for delays or failed handoffs', on: true },
])

const terminals = [
  { id: 1, name: 'Sunset POS', store: 'Sunset', status: 'Online' },
  { id: 2, name: 'South Beach POS', store: 'South Beach', status: 'Online' },
  { id: 3, name: 'Downtown POS', store: 'Downtown', status: 'Offline' },
]

const integrations = [
  { key: 'shopify', name: 'Shopify', desc: 'Sync catalog & orders', connected: true },
  { key: 'quickbooks', name: 'QuickBooks', desc: 'Auto-export invoices', connected: true },
  { key: 'zapier', name: 'Zapier', desc: 'Connect 2,000+ apps', connected: false },
  { key: 'slack', name: 'Slack', desc: 'Ops alerts & digests', connected: false },
]

const toggle = (i: number) => {
  toggles.value[i].on = !toggles.value[i].on
  props.notify(`${toggles.value[i].label} ${toggles.value[i].on ? 'enabled' : 'disabled'}`)
}
</script>

<template>
  <div>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      <!-- Workspace -->
      <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><Building2 :size="16" class="text-sky-400" /><h2 class="font-semibold">Workspace Profile</h2></div>
        <div class="space-y-4">
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Workspace name</label>
            <input v-model="workspace.name" type="text" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Notification email</label>
            <input v-model="workspace.email" type="email" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Timezone</label>
            <select v-model="workspace.timezone" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-sky-500 text-slate-300">
              <option>America/New_York</option><option>America/Chicago</option><option>America/Los_Angeles</option><option>UTC</option>
            </select>
          </div>
          <button @click="notify('Workspace profile saved')" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400"><Save :size="15" /> Save changes</button>
        </div>
      </div>

      <!-- Appearance + notifications -->
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div class="flex items-center gap-2 mb-3"><SunMedium :size="16" class="text-amber-400" /><h2 class="font-semibold">Appearance</h2></div>
          <div class="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-4 py-3">
            <span class="text-sm flex items-center gap-2.5"><component :is="theme === 'dark' ? MoonStar : SunMedium" :size="16" class="text-sky-400" /> {{ theme === 'dark' ? 'Dark' : 'Light' }} mode</span>
            <span class="text-[12px] text-slate-500">controlled from header toggle</span>
          </div>
        </div>

        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div class="flex items-center gap-2 mb-3"><Bell :size="16" class="text-violet-400" /><h2 class="font-semibold">Notifications</h2></div>
          <div class="space-y-3">
            <div v-for="(t, i) in toggles" :key="t.key" class="flex items-start justify-between gap-3">
              <div><p class="text-sm">{{ t.label }}</p><p class="text-[11px] text-slate-500">{{ t.desc }}</p></div>
              <button @click="toggle(i)" class="shrink-0 relative w-11 h-6 rounded-full transition-colors" :class="t.on ? 'bg-emerald-500' : 'bg-white/10'" :aria-pressed="t.on">
                <span class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" :class="t.on ? 'left-[22px]' : 'left-0.5'"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Store network -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
      <div class="flex items-center gap-2 p-4 border-b border-white/10"><Store :size="16" class="text-emerald-400" /><h2 class="font-semibold">Store Network</h2><span class="text-xs text-slate-400">· POS terminals</span></div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
            <th class="px-4 py-3">Terminal</th><th class="px-4 py-3">Store</th><th class="px-4 py-3">Status</th><th class="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            <tr v-for="t in terminals" :key="t.id" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3 font-medium flex items-center gap-2"><Globe :size="13" class="text-slate-500" /> {{ t.name }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ t.store }}</td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border" :class="t.status === 'Online' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/15 text-rose-300 border-rose-500/20'">{{ t.status }}</span></td>
              <td class="px-4 py-3 text-right"><button @click="notify(`Diagnostics requested for ${t.name}`)" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-300 hover:bg-white/10">Diagnose</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Integrations -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
      <div class="flex items-center gap-2 p-4 border-b border-white/10"><PlugZap :size="16" class="text-sky-400" /><h2 class="font-semibold">Integrations</h2><span class="text-xs text-slate-400">· connect external systems</span></div>
      <div class="divide-y divide-white/5">
        <div v-for="i in integrations" :key="i.key" class="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.02]">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"><Webhook :size="16" /></span>
            <div><p class="text-sm font-medium">{{ i.name }}</p><p class="text-[11px] text-slate-500">{{ i.desc }}</p></div>
          </div>
          <button @click="notify(`${i.name} ${i.connected ? 'disconnected' : 'connected'}`)"
            class="px-3.5 py-1.5 rounded-lg text-[12px] font-medium" :class="i.connected ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-indigo-500 text-white hover:bg-indigo-400'">
            {{ i.connected ? 'Disconnect' : 'Connect' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Security + danger -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><ShieldCheck :size="16" class="text-emerald-400" /><h2 class="font-semibold">Security</h2></div>
        <div class="rounded-xl bg-black/20 border border-white/10 px-4 py-3 flex items-center justify-between">
          <span class="text-sm flex items-center gap-2.5"><KeyRound :size="15" class="text-slate-400" /> API key</span>
          <span class="font-mono text-[12px] text-slate-400">hkx_live_••••••••8f3a</span>
        </div>
        <button @click="notify('API key regenerated — rotate in all clients')" class="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10"><RefreshCw :size="14" /> Regenerate key</button>
      </div>

      <div class="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
        <div class="flex items-center gap-2 mb-3"><Trash2 :size="16" class="text-rose-400" /><h2 class="font-semibold text-rose-300">Danger Zone</h2></div>
        <p class="text-[12px] text-slate-400 mb-4">Reset all dashboard demo data back to the seeded state. This cannot be undone.</p>
        <button @click="notify('Demo data has been reset', false)" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-sm font-medium hover:bg-rose-500/25"><Trash2 :size="14" /> Reset demo data</button>
      </div>
    </div>
  </div>
</template>