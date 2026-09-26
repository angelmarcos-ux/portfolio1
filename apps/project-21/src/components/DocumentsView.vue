<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileLock2, Lock, ShieldCheck, Download, Share2, PenLine, Search,
  FileText, FileCheck2, Clock, TriangleAlert,
} from 'lucide-vue-next'
import { vaultDocs } from '../data'
import type { DocKind, Notify } from '../types'

defineProps<{ notify: Notify }>()

const query = ref('')
const kindFilter = ref<DocKind | 'All'>('All')

const kinds: (DocKind | 'All')[] = ['All', 'Pleading', 'Contract', 'Evidence', 'Correspondence', 'Discovery', 'Identity']

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return vaultDocs.filter((d) => {
    const matchKind = kindFilter.value === 'All' || d.kind === kindFilter.value
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.matter.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
    return matchKind && matchQ
  })
})

const totalMb = Math.round(vaultDocs.reduce((n, d) => n + d.sizeKb, 0) / 1024)
const privileged = vaultDocs.filter((d) => d.classification === 'Attorney-Client Privileged' || d.classification === 'Work Product').length
const awaiting = vaultDocs.filter((d) => d.signature === 'Awaiting' || d.signature === 'Partially Signed').length
const unverified = vaultDocs.filter((d) => !d.verified).length

const kindIcon = (k: DocKind) =>
  k === 'Evidence' || k === 'Identity' ? ShieldCheck : k === 'Contract' ? PenLine : k === 'Discovery' ? FileLock2 : FileText

const sigTone = (s: string) =>
  s === 'Executed'
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
    : s === 'Awaiting'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
      : s === 'Partially Signed'
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20'
        : 'bg-white/5 text-slate-500 border-white/10'
</script>

<template>
  <div>
    <!-- Vault summary -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Total Size</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><FileLock2 :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ totalMb }} MB</p>
        <p class="text-[12px] text-slate-400 mt-1">AES-256 at rest</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Privileged</span><span class="p-1.5 rounded-lg bg-violet-500/10 text-violet-400"><Lock :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ privileged }}</p>
        <p class="text-[12px] text-slate-400 mt-1">access-logged documents</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Awaiting Signature</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><PenLine :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ awaiting }}</p>
        <p class="text-[12px] text-slate-400 mt-1">counterparty action required</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Unverified</span><span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><TriangleAlert :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ unverified }}</p>
        <p class="text-[12px] text-slate-400 mt-1">awaiting hash check</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="rounded-2xl bg-white/5 border border-white/10 p-4 mb-5">
      <div class="relative">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input v-model="query" type="text" placeholder="Search vault by name, matter, or document ID…"
          class="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
      </div>
      <div class="flex flex-wrap gap-1.5 mt-3">
        <button v-for="k in kinds" :key="k" @click="kindFilter = k"
          class="px-3 py-1.5 rounded-lg text-[12px] transition-colors"
          :class="kindFilter === k ? 'bg-emerald-500 text-slate-900 font-medium' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
          {{ k }}
        </button>
      </div>
    </section>

    <!-- Document table -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center gap-2"><FileLock2 :size="16" class="text-emerald-400" /><h2 class="font-semibold">Vault Documents</h2></div>
        <span class="text-xs text-slate-400">{{ filtered.length }} of {{ vaultDocs.length }}</span>
      </div>

      <div v-if="filtered.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
              <th class="px-4 py-3">Document</th>
              <th class="px-4 py-3">Matter</th>
              <th class="px-4 py-3">Classification</th>
              <th class="px-4 py-3">Signature</th>
              <th class="px-4 py-3 text-right">Size</th>
              <th class="px-4 py-3">Updated</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in filtered" :key="d.id" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <span class="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400"><component :is="kindIcon(d.kind)" :size="14" /></span>
                  <div class="min-w-0">
                    <p class="font-medium truncate flex items-center gap-1.5">
                      {{ d.name }}
                      <ShieldCheck v-if="d.verified" :size="12" class="text-emerald-400 shrink-0" />
                      <TriangleAlert v-else :size="12" class="text-rose-400 shrink-0" />
                    </p>
                    <p class="text-[11px] text-slate-500 font-mono">{{ d.id }} · v{{ d.version }} · {{ d.kind }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-[12px] font-mono text-cyan-300">{{ d.matter }}</td>
              <td class="px-4 py-3">
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 whitespace-nowrap">{{ d.classification }}</span>
              </td>
              <td class="px-4 py-3"><span class="text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap" :class="sigTone(d.signature)">{{ d.signature }}</span></td>
              <td class="px-4 py-3 text-right text-slate-300 whitespace-nowrap">{{ d.sizeKb >= 1024 ? (d.sizeKb / 1024).toFixed(1) + ' MB' : d.sizeKb + ' KB' }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400 whitespace-nowrap flex items-center gap-1.5"><Clock :size="11" /> {{ d.updated }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="notify(`Secure link created for ${d.name}`)" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10" aria-label="Share securely"><Share2 :size="13" /></button>
                  <button @click="notify(`Decrypting ${d.name}…`)" class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10" aria-label="Download"><Download :size="13" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-14 text-center">
        <FileCheck2 :size="28" class="mx-auto text-slate-600" />
        <p class="text-sm text-slate-400 mt-3">No documents match this filter.</p>
      </div>
    </section>

    <p class="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
      <Lock :size="12" /> Document keys never leave the client device. Shares are single-use, expiry-bound and watermarked.
    </p>
  </div>
</template>
