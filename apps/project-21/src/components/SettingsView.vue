<script setup lang="ts">
import { ref } from 'vue'
import {
  Save, Globe, Bell, PlugZap, Webhook, Scale, Trash2,
  ShieldCheck, KeyRound, RefreshCw, SunMedium, MoonStar, Building2, Lock,
} from 'lucide-vue-next'
import type { Notify } from '../types'

const props = defineProps<{ notify: Notify; theme: 'dark' | 'light' }>()

const firm = ref({ name: 'LegalTech Connect LLP', email: 'intake@legaltechconnect.com', timezone: 'America/New_York', barNumber: 'FL-448201' })

const toggles = ref([
  { key: 'deadline', label: 'Deadline alerts', desc: 'Notify the assigned partner when a court or statutory deadline is within 7 days', on: true },
  { key: 'verify', label: 'Block unverified recipients', desc: 'Prevent sharing privileged files with contacts whose safety number is unconfirmed', on: true },
  { key: 'digest', label: 'Daily docket digest', desc: 'Morning summary of deadlines, new messages and signature requests', on: true },
  { key: 'watermark', label: 'Watermark shared documents', desc: 'Stamp exports with the viewer identity and access timestamp', on: false },
  { key: 'autoexpire', label: 'Expire document links', desc: 'Shared links become invalid after 24 hours or first download', on: true },
])

const devices = [
  { id: 1, name: 'iPhone 16 Pro', kind: 'This device', status: 'Trusted', key: 'a4f1…9c02' },
  { id: 2, name: 'MacBook Pro 16"', kind: 'Desktop', status: 'Trusted', key: '7b83…1de4' },
  { id: 3, name: 'iPad Air', kind: 'Tablet', status: 'Trusted', key: 'c920…4a77' },
]

const integrations = [
  { key: 'clio', name: 'Clio Manage', desc: 'Sync matters, contacts and billing', connected: true },
  { key: 'docket', name: 'PACER / CourtListener', desc: 'Pull dockets and filing deadlines', connected: true },
  { key: 'docu', name: 'DocuSign', desc: 'Route documents for e-signature', connected: true },
  { key: 'onfido', name: 'Onfido ID Verification', desc: 'Automated KYC for new clients', connected: false },
]

const toggle = (i: number) => {
  toggles.value[i].on = !toggles.value[i].on
  props.notify(`${toggles.value[i].label} ${toggles.value[i].on ? 'enabled' : 'disabled'}`)
}
</script>

<template>
  <div>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      <!-- Firm profile -->
      <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><Building2 :size="16" class="text-emerald-400" /><h2 class="font-semibold">Firm Profile</h2></div>
        <div class="space-y-4">
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Firm name</label>
            <input v-model="firm.name" type="text" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Intake email</label>
            <input v-model="firm.email" type="email" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Primary bar admission</label>
            <input v-model="firm.barNumber" type="text" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-[12px] text-slate-400 mb-1.5">Timezone</label>
            <select v-model="firm.timezone" class="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 text-slate-300">
              <option>America/New_York</option><option>America/Chicago</option><option>America/Los_Angeles</option><option>UTC</option>
            </select>
          </div>
          <button @click="notify('Firm profile saved')" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 text-sm font-medium hover:bg-emerald-400"><Save :size="15" /> Save changes</button>
        </div>
      </div>

      <!-- Appearance + notifications -->
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div class="flex items-center gap-2 mb-3"><SunMedium :size="16" class="text-amber-400" /><h2 class="font-semibold">Appearance</h2></div>
          <div class="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-4 py-3">
            <span class="text-sm flex items-center gap-2.5"><component :is="theme === 'dark' ? MoonStar : SunMedium" :size="16" class="text-emerald-400" /> {{ theme === 'dark' ? 'Dark' : 'Light' }} mode</span>
            <span class="text-[12px] text-slate-500">controlled from header toggle</span>
          </div>
        </div>

        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div class="flex items-center gap-2 mb-3"><Bell :size="16" class="text-cyan-400" /><h2 class="font-semibold">Security & Notifications</h2></div>
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

    <!-- Trusted devices -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
      <div class="flex items-center gap-2 p-4 border-b border-white/10"><Globe :size="16" class="text-emerald-400" /><h2 class="font-semibold">Trusted Devices</h2><span class="text-xs text-slate-400">· linked via QR handshake</span></div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
            <th class="px-4 py-3">Device</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Identity Key</th><th class="px-4 py-3">Status</th><th class="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            <tr v-for="d in devices" :key="d.id" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3 font-medium">{{ d.name }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ d.kind }}</td>
              <td class="px-4 py-3 font-mono text-[12px] text-cyan-300">{{ d.key }}</td>
              <td class="px-4 py-3"><span class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"><ShieldCheck :size="10" /> {{ d.status }}</span></td>
              <td class="px-4 py-3 text-right"><button @click="notify(`Unlinked ${d.name}`)" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-300 hover:bg-white/10">Unlink</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Integrations -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-6">
      <div class="flex items-center gap-2 p-4 border-b border-white/10"><PlugZap :size="16" class="text-cyan-400" /><h2 class="font-semibold">Integrations</h2><span class="text-xs text-slate-400">· connect practice systems</span></div>
      <div class="divide-y divide-white/5">
        <div v-for="i in integrations" :key="i.key" class="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.02]">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"><Webhook :size="16" /></span>
            <div><p class="text-sm font-medium">{{ i.name }}</p><p class="text-[11px] text-slate-500">{{ i.desc }}</p></div>
          </div>
          <button @click="notify(`${i.name} ${i.connected ? 'disconnected' : 'connected'}`)"
            class="px-3.5 py-1.5 rounded-lg text-[12px] font-medium" :class="i.connected ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'">
            {{ i.connected ? 'Disconnect' : 'Connect' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Security + danger -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div class="flex items-center gap-2 mb-4"><ShieldCheck :size="16" class="text-emerald-400" /><h2 class="font-semibold">Encryption</h2></div>
        <div class="rounded-xl bg-black/20 border border-white/10 px-4 py-3 flex items-center justify-between">
          <span class="text-sm flex items-center gap-2.5"><KeyRound :size="15" class="text-slate-400" /> Server API key</span>
          <span class="font-mono text-[12px] text-slate-400">ltc_live_••••••••c71b</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-3 flex items-start gap-1.5">
          <Lock :size="12" class="shrink-0 mt-0.5" /> The server stores ciphertext only. Document keys are derived on-device and never transmitted.
        </p>
        <button @click="notify('Prekey bundle rotated across all trusted devices')" class="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10"><RefreshCw :size="14" /> Rotate prekeys</button>
      </div>

      <div class="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
        <div class="flex items-center gap-2 mb-3"><Trash2 :size="16" class="text-rose-400" /><h2 class="font-semibold text-rose-300">Danger Zone</h2></div>
        <p class="text-[12px] text-slate-400 mb-4">Purge all locally held encryption keys and reset the console to its seeded state. Every encrypted thread becomes permanently unreadable. This cannot be undone.</p>
        <button @click="notify('Local key material wiped and demo data reset', false)" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-sm font-medium hover:bg-rose-500/25"><Trash2 :size="14" /> Wipe keys &amp; reset</button>
      </div>
    </div>

    <p class="text-[11px] text-slate-500 mt-5 flex items-center gap-1.5"><Scale :size="12" /> LegalTech Connect LLP · authorised users only · all access is audit-logged</p>
  </div>
</template>
