<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Users, ShieldCheck, TriangleAlert, Search, MessageSquarePlus, KeyRound,
  Mail, Smartphone, AppWindow, Send, UserCheck,
} from 'lucide-vue-next'
import { contacts } from '../data'
import type { Contact, Notify } from '../types'

const props = defineProps<{ notify: Notify }>()

const query = ref('')
const trustFilter = ref<Contact['trust'] | 'All'>('All')

const trusts: (Contact['trust'] | 'All')[] = ['All', 'Verified', 'Pending', 'Unverified']

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return contacts.filter((c) => {
    const matchTrust = trustFilter.value === 'All' || c.trust === trustFilter.value
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.org.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    return matchTrust && matchQ
  })
})

const trustTone = (t: Contact['trust']) =>
  t === 'Verified'
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
    : t === 'Pending'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
      : 'bg-rose-500/15 text-rose-300 border-rose-500/20'

const channelIcon = (c: Contact['channel']) => (c === 'Signal' ? KeyRound : c === 'Email Bridge' ? Mail : AppWindow)
const channelTone = (c: Contact['channel']) =>
  c === 'Signal'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : c === 'Email Bridge'
      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      : 'bg-violet-500/10 text-violet-400 border-violet-500/20'

const verified = contacts.filter((c) => c.trust === 'Verified').length
const noMfa = contacts.filter((c) => !c.mfa).length

const startThread = (c: Contact) =>
  props.notify(
    c.trust === 'Verified'
      ? `Secure thread opened with ${c.name} — safety number confirmed`
      : `Invite sent to ${c.name} — identity must be verified before sending`,
    c.trust === 'Verified',
  )
</script>

<template>
  <div>
    <!-- Summary -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Directory</span><span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Users :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ contacts.length }}</p>
        <p class="text-[12px] text-slate-400 mt-1">clients, counsel & team</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Verified</span><span class="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><UserCheck :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ verified }}</p>
        <p class="text-[12px] text-slate-400 mt-1">safety numbers confirmed</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Pending Identity</span><span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><TriangleAlert :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ contacts.length - verified }}</p>
        <p class="text-[12px] text-slate-400 mt-1">cannot receive privileged files</p>
      </div>
      <div class="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div class="flex items-center justify-between"><span class="text-[13px] text-slate-400">Without MFA</span><span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><Smartphone :size="16" /></span></div>
        <p class="text-2xl font-bold mt-2">{{ noMfa }}</p>
        <p class="text-[12px] text-slate-400 mt-1">enrolment recommended</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="rounded-2xl bg-white/5 border border-white/10 p-4 mb-5">
      <div class="relative">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input v-model="query" type="text" placeholder="Search people, firms, roles…"
          class="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
      </div>
      <div class="flex flex-wrap gap-1.5 mt-3">
        <button v-for="t in trusts" :key="t" @click="trustFilter = t"
          class="px-3 py-1.5 rounded-lg text-[12px] transition-colors"
          :class="trustFilter === t ? 'bg-emerald-500 text-slate-900 font-medium' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
          {{ t }}
        </button>
      </div>
    </section>

    <!-- Contact table -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center gap-2"><Users :size="16" class="text-emerald-400" /><h2 class="font-semibold">People</h2></div>
        <span class="text-xs text-slate-400">{{ filtered.length }} of {{ contacts.length }}</span>
      </div>

      <div v-if="filtered.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-white/10">
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Organisation</th>
              <th class="px-4 py-3">Channel</th>
              <th class="px-4 py-3">Identity</th>
              <th class="px-4 py-3 text-right">Matters</th>
              <th class="px-4 py-3">Last Contact</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.name" class="border-b border-white/5 hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <span class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-[11px] font-semibold text-emerald-200">
                    {{ c.name.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
                  </span>
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ c.name }}</p>
                    <p class="text-[11px] text-slate-500 truncate">{{ c.role }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-[12px] text-slate-400">{{ c.org }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border" :class="channelTone(c.channel)">
                  <component :is="channelIcon(c.channel)" :size="10" /> {{ c.channel }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap" :class="trustTone(c.trust)">
                  <component :is="c.trust === 'Verified' ? ShieldCheck : TriangleAlert" :size="10" /> {{ c.trust }}
                </span>
                <p v-if="!c.mfa" class="text-[10px] text-rose-400 mt-1">MFA not enrolled</p>
              </td>
              <td class="px-4 py-3 text-right text-slate-300">{{ c.matters }}</td>
              <td class="px-4 py-3 text-[12px] text-slate-400 whitespace-nowrap">{{ c.lastContact }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="startThread(c)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                  :class="c.trust === 'Verified' ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'">
                  <MessageSquarePlus :size="13" /> {{ c.trust === 'Verified' ? 'Message' : 'Invite' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-14 text-center">
        <Send :size="28" class="mx-auto text-slate-600" />
        <p class="text-sm text-slate-400 mt-3">No contacts match this filter.</p>
      </div>
    </section>
  </div>
</template>
