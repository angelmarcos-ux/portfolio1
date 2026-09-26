<script setup lang="ts">
import { computed } from 'vue'
import {
  Scale, FileLock2, MessagesSquare, Gavel, TrendingUp, TrendingDown,
  CalendarDays, PieChart, Lock, ShieldCheck, PenLine, ChevronRight,
} from 'lucide-vue-next'
import { matters, threads, vaultDocs, practiceMix } from '../data'
import type { Notify } from '../types'

defineProps<{ notify: Notify }>()

const urgent = computed(() => [...matters].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5))
const totalBillable = matters.reduce((n, m) => n + m.billable, 0)
const vaultSizeMb = Math.round(vaultDocs.reduce((n, d) => n + d.sizeKb, 0) / 1024)
const unreadTotal = threads.reduce((n, t) => n + t.unread, 0)

const deadlineTone = (d: number) => (d <= 3 ? 'text-rose-400' : d <= 9 ? 'text-amber-300' : 'text-slate-300')
</script>

<template>
  <div>
    <!-- Stat cards -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Active Matters</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Scale :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ matters.length }}</p>
        <p class="text-[12px] text-rose-400 mt-1 flex items-center gap-1"><TrendingUp :size="13" /> 2 critical · 3 due this week</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Vault Documents</span><span class="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><FileLock2 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ vaultDocs.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">{{ vaultSizeMb }} MB client-encrypted</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Unread Messages</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><MessagesSquare :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ unreadTotal }}</p>
        <p class="text-[12px] text-slate-400 mt-1">across {{ threads.length }} secure threads</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Unbilled Time</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Gavel :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">${{ totalBillable.toLocaleString() }}</p>
        <p class="text-[12px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingDown :size="13" /> -4.1% vs last cycle</p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Deadline tracker -->
      <section class="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <div class="flex items-center gap-2"><Gavel :size="16" class="text-amber-400" /><h2 class="font-semibold">Upcoming Deadlines</h2></div>
          <span class="text-xs text-slate-400">next 30 days</span>
        </div>
        <div class="divide-y divide-white/5">
          <button v-for="m in urgent" :key="m.ref" @click="notify(`${m.ref} — ${m.title}`)"
            class="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors">
            <div class="shrink-0 w-11 text-center">
              <p class="text-lg font-bold leading-none" :class="deadlineTone(m.daysLeft)">{{ m.daysLeft }}</p>
              <p class="text-[10px] text-slate-500 uppercase tracking-wide">days</p>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">{{ m.title }}</p>
              <p class="text-[11px] text-slate-500 truncate">{{ m.nextDeadline }} · {{ m.ref }}</p>
            </div>
            <span class="shrink-0 text-[11px] px-2 py-0.5 rounded-full border"
              :class="m.priority === 'Critical' ? 'bg-rose-500/15 text-rose-300 border-rose-500/20' : m.priority === 'High' ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-white/5 text-slate-400 border-white/10'">
              {{ m.priority }}
            </span>
            <ChevronRight :size="15" class="shrink-0 text-slate-600" />
          </button>
        </div>
      </section>

      <!-- Practice mix -->
      <section class="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div class="flex items-center gap-2 mb-4"><PieChart :size="16" class="text-cyan-400" /><h2 class="font-semibold">Practice Mix</h2></div>
        <div class="flex items-center justify-center py-4">
          <div class="relative w-40 h-40 rounded-full" style="background: conic-gradient(#10b981 0 28%, #22d3ee 28% 50%, #a78bfa 50% 68%, #fbbf24 68% 85%, #fb7185 85% 100%)">
            <div class="absolute inset-5 rounded-full bg-[#061613] flex items-center justify-center text-center"><div><p class="text-2xl font-bold">{{ matters.length }}</p><p class="text-[11px] text-slate-400">matters</p></div></div>
          </div>
        </div>
        <div class="space-y-2.5">
          <div v-for="p in practiceMix" :key="p.name" class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full" :style="{ background: p.color }"></span>{{ p.name }}</span>
            <span class="text-slate-400">{{ p.pct }}%</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Vault status + signature queue -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div class="flex items-center gap-2 p-4 border-b border-white/10"><ShieldCheck :size="16" class="text-emerald-400" /><h2 class="font-semibold">Encryption Posture</h2></div>
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-4 py-3">
            <span class="text-sm flex items-center gap-2.5"><Lock :size="15" class="text-emerald-400" /> Double Ratchet sessions</span>
            <span class="text-[12px] text-emerald-300 font-medium">6 / 6 healthy</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-4 py-3">
            <span class="text-sm flex items-center gap-2.5"><Lock :size="15" class="text-emerald-400" /> X3DH prekey bundles</span>
            <span class="text-[12px] text-emerald-300 font-medium">Rotated 6h ago</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-4 py-3">
            <span class="text-sm flex items-center gap-2.5"><Lock :size="15" class="text-amber-400" /> Sessions needing rekey</span>
            <span class="text-[12px] text-amber-300 font-medium">1 (Ardent IP)</span>
          </div>
          <p class="text-[11px] text-slate-500 pt-1">Messages and documents are sealed client-side. The server relays ciphertext only — no plaintext or keys leave the device.</p>
        </div>
      </section>

      <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div class="flex items-center gap-2 p-4 border-b border-white/10"><PenLine :size="16" class="text-violet-400" /><h2 class="font-semibold">Signature Queue</h2><span class="text-xs text-slate-400">· e-signature pending</span></div>
        <div class="divide-y divide-white/5">
          <div v-for="d in vaultDocs.filter((x) => x.signature === 'Awaiting' || x.signature === 'Partially Signed')" :key="d.id"
            class="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.02]">
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ d.name }}</p>
              <p class="text-[11px] text-slate-500">{{ d.matter }} · v{{ d.version }} · {{ d.classification }}</p>
            </div>
            <button @click="notify(`Reminder sent for ${d.name}`)" class="shrink-0 px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 text-[12px] hover:bg-violet-500/25">Remind</button>
          </div>
        </div>
      </section>
    </div>

    <footer class="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-400">
      <span class="flex items-center gap-2"><Lock :size="14" /> Zero-knowledge storage · SOC 2 Type II</span>
      <span class="hidden sm:inline">LegalTech Connect v1.0 · {{ matters.length }} matters · Signal Protocol</span>
    </footer>
    <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarDays :size="12" /> Vault synced 3 min ago</p>
  </div>
</template>
