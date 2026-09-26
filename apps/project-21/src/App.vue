<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  Scale, FolderOpen, FileLock2, MessagesSquare, Users, Settings,
  RefreshCw, CheckCircle2, TriangleAlert, CalendarDays, Sun, Moon, LayoutDashboard, Bell, Lock,
} from 'lucide-vue-next'
import { matters, threads, vaultDocs } from './data'
import OverviewView from './components/OverviewView.vue'
import MattersView from './components/MattersView.vue'
import DocumentsView from './components/DocumentsView.vue'
import MessagesView from './components/MessagesView.vue'
import ContactsView from './components/ContactsView.vue'
import SettingsView from './components/SettingsView.vue'

const theme = ref<'dark' | 'light'>('dark')
const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark')

const clock = ref(new Date())
const timer = setInterval(() => (clock.value = new Date()), 1000)
onUnmounted(() => clearInterval(timer))
const liveClock = computed(() =>
  clock.value.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
)
const today = computed(() =>
  clock.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
)

type ViewKey = 'overview' | 'matters' | 'documents' | 'messages' | 'contacts' | 'settings'
const currentView = ref<ViewKey>('overview')

const views: { key: ViewKey; label: string; icon: typeof FolderOpen }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'matters', label: 'Matters', icon: FolderOpen },
  { key: 'documents', label: 'Vault', icon: FileLock2 },
  { key: 'messages', label: 'Messages', icon: MessagesSquare },
  { key: 'contacts', label: 'Directory', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const titles: Record<ViewKey, string> = {
  overview: 'Practice Console',
  matters: 'Active Matters',
  documents: 'Encrypted Vault',
  messages: 'Secure Messages',
  contacts: 'Client Directory',
  settings: 'Firm Settings',
}

const critical = computed(() => matters.filter((m) => m.priority === 'Critical'))
const unreadTotal = computed(() => threads.reduce((n, t) => n + t.unread, 0))
const pendingSign = computed(() => vaultDocs.filter((d) => d.signature !== 'Not Requested' && d.signature !== 'Executed').length)

/* ---- toast system ---- */
const toasts = ref<{ id: number; msg: string; ok: boolean }[]>([])
let tid = 0
const notify = (msg: string, ok = true) => {
  const id = ++tid
  toasts.value.push({ id, msg, ok })
  setTimeout(() => (toasts.value = toasts.value.filter((t) => t.id !== id)), 3200)
}

const resync = () => notify('Prekeys rotated · 6 sessions re-established · ratchets healthy')
</script>

<template>
  <div :class="theme" class="min-h-screen bg-[#04110f] text-slate-100 font-sans">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 hidden md:flex flex-col gap-5 p-5 border-r border-white/10 bg-white/[0.02] sticky top-0 h-screen">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Scale :size="18" /></div>
          <div><p class="font-bold leading-tight">LegalTech</p><p class="text-[11px] text-slate-400">Secure Client Connect</p></div>
        </div>
        <nav class="flex flex-col gap-1 text-sm">
          <button v-for="v in views" :key="v.key" @click="currentView = v.key"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left"
            :class="currentView === v.key ? 'bg-emerald-500/15 text-emerald-300 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'">
            <component :is="v.icon" :size="16" /> {{ v.label }}
            <span v-if="v.key === 'messages' && unreadTotal" class="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-900 font-semibold">{{ unreadTotal }}</span>
          </button>
        </nav>
        <div class="mt-auto rounded-xl p-3.5 bg-emerald-500/10 border border-emerald-500/20">
          <div class="flex items-center gap-2 text-emerald-300"><Bell :size="14" /><p class="text-xs font-semibold">Deadline watch</p></div>
          <p class="text-[11px] text-slate-400 mt-1">{{ critical.length }} critical matters · next in 3 days</p>
          <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5"><Lock :size="11" /> {{ pendingSign }} awaiting signature</p>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 p-5 md:p-7 pb-10">
        <header class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2.5 flex-wrap">LegalTech Connect<span class="text-emerald-400">{{ titles[currentView] }}</span>
              <span class="text-[11px] font-normal px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">E2EE</span>
            </h1>
            <p class="text-sm text-slate-400 mt-1 flex items-center gap-2"><CalendarDays :size="14" /> {{ today }} · {{ liveClock }} · {{ matters.length }} active matters</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="resync" class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10"><RefreshCw :size="15" /> Rotate keys</button>
            <button @click="toggleTheme" class="p-2 rounded-lg bg-white/5 border border-white/10" aria-label="Toggle theme"><Sun v-if="theme === 'dark'" :size="16" /><Moon v-else :size="16" /></button>
          </div>
        </header>

        <!-- Mobile nav -->
        <nav class="md:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1 mb-4">
          <button v-for="v in views" :key="v.key" @click="currentView = v.key"
            class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] transition-colors"
            :class="currentView === v.key ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/20' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'">
            <component :is="v.icon" :size="14" /> {{ v.label }}
          </button>
        </nav>

        <!-- View switch -->
        <transition name="view" mode="out-in">
          <OverviewView v-if="currentView === 'overview'" key="overview" :notify="notify" />
          <MattersView v-else-if="currentView === 'matters'" key="matters" :notify="notify" />
          <DocumentsView v-else-if="currentView === 'documents'" key="documents" :notify="notify" />
          <MessagesView v-else-if="currentView === 'messages'" key="messages" :notify="notify" />
          <ContactsView v-else-if="currentView === 'contacts'" key="contacts" :notify="notify" />
          <SettingsView v-else key="settings" :notify="notify" :theme="theme" />
        </transition>
      </main>
    </div>

    <!-- Toasts -->
    <teleport to="body">
      <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id"
            :class="t.ok ? 'border-emerald-500/40 text-emerald-200' : 'border-rose-500/40 text-rose-200'"
            class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#071a16] border text-sm shadow-2xl">
            <CheckCircle2 v-if="t.ok" :size="16" /><TriangleAlert v-else :size="16" />{{ t.msg }}
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<style>
.view-enter-active, .view-leave-active { transition: opacity 0.15s, transform 0.15s ease; }
.view-enter-from { opacity: 0; transform: translateY(6px); }
.view-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
