<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  MessagesSquare, Lock, ShieldCheck, Send, KeyRound, RefreshCw, TriangleAlert,
  Search, Info, CheckCheck,
} from 'lucide-vue-next'
import { threads } from '../data'
import type { Notify } from '../types'

const props = defineProps<{ notify: Notify }>()

const activeId = ref(threads[0].id)
const draft = ref('')
const sent = ref<Record<string, string[]>>({})
const composer = ref<HTMLTextAreaElement | null>(null)

const active = computed(() => threads.find((t) => t.id === activeId.value) ?? threads[0])
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return threads.filter(
    (t) => !q || t.party.toLowerCase().includes(q) || t.matter.toLowerCase().includes(q),
  )
})

const outgoing = computed(() => sent.value[activeId.value] ?? [])

const send = async () => {
  const text = draft.value.trim()
  if (!text) return
  if (!sent.value[activeId.value]) sent.value[activeId.value] = []
  sent.value[activeId.value].push(text)
  draft.value = ''
  await nextTick()
  composer.value?.focus()
  props.notify('Message sealed and delivered over the double ratchet')
}

const rekey = () => props.notify(`Prekey bundle refreshed with ${active.value.party}`)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <!-- Thread list -->
    <section class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden lg:max-h-[640px]">
      <div class="p-4 border-b border-white/10">
        <div class="flex items-center gap-2 mb-3"><MessagesSquare :size="16" class="text-emerald-400" /><h2 class="font-semibold">Secure Threads</h2></div>
        <div class="relative">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="query" type="text" placeholder="Search threads…"
            class="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2 text-sm outline-none focus:border-emerald-500" />
        </div>
      </div>
      <div class="divide-y divide-white/5 overflow-y-auto">
        <button v-for="t in filtered" :key="t.id" @click="activeId = t.id"
          class="w-full text-left px-4 py-3.5 transition-colors"
          :class="activeId === t.id ? 'bg-emerald-500/10' : 'hover:bg-white/[0.03]'">
          <div class="flex items-start gap-3">
            <div class="relative shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-[12px] font-semibold text-emerald-200">
              {{ t.party.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
              <span v-if="t.online" class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#061613]"></span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2">
                <p class="text-sm font-medium truncate">{{ t.party }}</p>
                <span class="shrink-0 text-[10px] text-slate-500">{{ t.time }}</span>
              </div>
              <p class="text-[11px] text-cyan-400 font-mono">{{ t.matter }}</p>
              <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ t.lastMessage }}</p>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span v-if="t.unread" class="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-900 font-semibold">{{ t.unread }}</span>
                <span class="flex items-center gap-1 text-[10px] text-emerald-400"><Lock :size="9" /> E2EE</span>
                <TriangleAlert v-if="!t.ratchetHealthy" :size="11" class="text-amber-400" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- Conversation -->
    <section class="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 flex flex-col overflow-hidden lg:max-h-[640px]">
      <!-- Header -->
      <header class="p-4 border-b border-white/10">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-[13px] font-semibold text-emerald-200">
              {{ active.party.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
              <span v-if="active.online" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#061613]"></span>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold truncate">{{ active.party }}</p>
              <p class="text-[11px] text-slate-500 truncate">{{ active.role }} · {{ active.matter }}</p>
            </div>
          </div>
          <button @click="rekey" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-300 hover:bg-white/10">
            <RefreshCw :size="12" /> Rekey
          </button>
        </div>

        <!-- Security strip -->
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <span class="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock :size="10" /> Double ratchet
          </span>
          <span v-if="active.identityVerified" class="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <ShieldCheck :size="10" /> Identity verified
          </span>
          <span v-else class="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <TriangleAlert :size="10" /> Safety number unconfirmed
          </span>
          <span class="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <KeyRound :size="10" /> {{ active.safetyNumber }}
          </span>
        </div>
      </header>

      <!-- Messages -->
      <div class="flex-1 p-4 space-y-3 overflow-y-auto">
        <div class="rounded-xl border border-white/10 bg-black/20 p-3.5">
          <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
            <Info :size="12" /> {{ active.party }}
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">{{ active.lastMessage }}</p>
        </div>

        <div class="text-center py-1">
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500">Messages are end-to-end encrypted. Not even LegalTech Connect can read them.</span>
        </div>

        <div v-for="(m, i) in outgoing" :key="i" class="flex justify-end">
          <div class="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-emerald-500/15 border border-emerald-500/25">
            <p class="text-sm text-emerald-50 leading-relaxed">{{ m }}</p>
            <p class="text-[10px] text-emerald-400/70 mt-1 flex items-center justify-end gap-1">Delivered <CheckCheck :size="10" /></p>
          </div>
        </div>
      </div>

      <!-- Composer -->
      <footer class="p-3 border-t border-white/10 flex items-end gap-2">
        <textarea ref="composer" v-model="draft" @keydown.enter.exact.prevent="send" rows="1"
          placeholder="Write an encrypted message…"
          class="flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 max-h-28" />
        <button @click="send" :disabled="!draft.trim()"
          class="shrink-0 p-2.5 rounded-xl bg-emerald-500 text-slate-900 transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500"
          aria-label="Send encrypted message">
          <Send :size="16" />
        </button>
      </footer>
    </section>
  </div>
</template>
