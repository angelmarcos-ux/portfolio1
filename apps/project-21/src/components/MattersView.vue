<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FolderOpen, Lock, MessagesSquare, FileText, Gavel, Search, SlidersHorizontal,
  ChevronRight, CircleDollarSign,
} from 'lucide-vue-next'
import { matters } from '../data'
import type { MatterStage, Notify } from '../types'

defineProps<{ notify: Notify }>()

const query = ref('')
const stageFilter = ref<MatterStage | 'All'>('All')
const sortByDeadline = ref(true)

const stages: (MatterStage | 'All')[] = ['All', 'Intake', 'Pleadings', 'Discovery', 'Negotiation', 'Trial Prep', 'Closing']

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let out = matters.filter((m) => stageFilter.value === 'All' || m.stage === stageFilter.value)
  if (q) {
    out = out.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.client.toLowerCase().includes(q) ||
        m.ref.toLowerCase().includes(q) ||
        m.practice.toLowerCase().includes(q),
    )
  }
  return sortByDeadline.value ? [...out].sort((a, b) => a.daysLeft - b.daysLeft) : out
})

const stageTone = (s: MatterStage) =>
  ({
    Intake: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
    Pleadings: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
    Discovery: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    Negotiation: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    'Trial Prep': 'bg-rose-500/15 text-rose-300 border-rose-500/20',
    Closing: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  })[s]

const priorityTone = (p: string) =>
  p === 'Critical'
    ? 'bg-rose-500/15 text-rose-300 border-rose-500/20'
    : p === 'High'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
      : 'bg-white/5 text-slate-400 border-white/10'
</script>

<template>
  <div>
    <!-- Filters -->
    <section class="rounded-2xl bg-white/5 border border-white/10 p-4 mb-5">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[220px]">
          <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="query" type="text" placeholder="Search matters, clients, references…"
            class="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
        </div>
        <button @click="sortByDeadline = !sortByDeadline"
          class="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm border transition-colors"
          :class="sortByDeadline ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'">
          <SlidersHorizontal :size="15" /> Deadline
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-3">
        <button v-for="s in stages" :key="s" @click="stageFilter = s"
          class="px-3 py-1.5 rounded-lg text-[12px] transition-colors"
          :class="stageFilter === s ? 'bg-emerald-500 text-slate-900 font-medium' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
          {{ s }}
        </button>
      </div>
    </section>

    <!-- Matter cards -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <article v-for="m in filtered" :key="m.ref"
        class="rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-emerald-500/30 transition-colors">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-mono text-[11px] text-emerald-400">{{ m.ref }}</p>
            <h3 class="text-sm font-semibold mt-0.5 truncate">{{ m.title }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">{{ m.client }} · {{ m.practice }}</p>
          </div>
          <span class="shrink-0 text-[11px] px-2 py-0.5 rounded-full border" :class="priorityTone(m.priority)">{{ m.priority }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 mt-3">
          <span class="text-[11px] px-2 py-0.5 rounded-full border" :class="stageTone(m.stage)">{{ m.stage }}</span>
          <span v-if="m.encrypted" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock :size="10" /> E2EE
          </span>
          <span v-if="m.unread" class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <MessagesSquare :size="10" /> {{ m.unread }} unread
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 mt-3.5">
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2">
            <p class="text-[10px] text-slate-500 uppercase tracking-wide">Deadline</p>
            <p class="text-sm font-semibold mt-0.5" :class="m.daysLeft <= 3 ? 'text-rose-400' : m.daysLeft <= 9 ? 'text-amber-300' : ''">{{ m.daysLeft }}d</p>
          </div>
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2">
            <p class="text-[10px] text-slate-500 uppercase tracking-wide">Docs</p>
            <p class="text-sm font-semibold mt-0.5 flex items-center gap-1"><FileText :size="12" class="text-slate-500" /> {{ m.docs }}</p>
          </div>
          <div class="rounded-lg bg-black/20 border border-white/10 px-3 py-2">
            <p class="text-[10px] text-slate-500 uppercase tracking-wide">Billable</p>
            <p class="text-sm font-semibold mt-0.5 flex items-center gap-1"><CircleDollarSign :size="12" class="text-slate-500" /> {{ (m.billable / 1000).toFixed(1) }}k</p>
          </div>
        </div>

        <p class="text-[11px] text-slate-400 mt-3 truncate">{{ m.nextDeadline }}</p>

        <div class="flex items-center gap-2 mt-3">
          <button @click="notify(`Opened ${m.ref} — secure workspace`)"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-[12px] font-medium hover:bg-emerald-500/25">
            <FolderOpen :size="13" /> Open matter
          </button>
          <button @click="notify(`Secure thread opened for ${m.ref}`)" class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10" aria-label="Open secure thread">
            <MessagesSquare :size="14" />
          </button>
          <button @click="notify(`${m.ref} calendared — ${m.nextDeadline}`, false)" class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10" aria-label="Calendar deadline">
            <Gavel :size="14" />
          </button>
        </div>
      </article>

      <div v-if="!filtered.length" class="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 py-14 text-center">
        <FolderOpen :size="28" class="mx-auto text-slate-600" />
        <p class="text-sm text-slate-400 mt-3">No matters match this filter.</p>
        <button @click="query = ''; stageFilter = 'All'" class="mt-3 inline-flex items-center gap-1.5 text-[12px] text-emerald-400 hover:text-emerald-300">
          Clear filters <ChevronRight :size="13" />
        </button>
      </div>
    </section>
  </div>
</template>
