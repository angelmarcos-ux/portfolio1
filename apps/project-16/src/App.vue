<script setup lang="ts">
import { ref } from 'vue'
import {
  Building2, Home, MapPinned, Calculator, LandPlot, BarChart3,
  RefreshCw, Crown, CheckCircle2, TriangleAlert,
} from 'lucide-vue-next'
import PortfolioView from './components/PortfolioView.vue'
import MarketMapView from './components/MarketMapView.vue'
import AVMStudioView from './components/AVMStudioView.vue'
import LandBankView from './components/LandBankView.vue'
import ComparablesView from './components/ComparablesView.vue'

const theme = ref<'dark' | 'light'>('dark')
const toggleTheme = () => { theme.value = theme.value === 'dark' ? 'light' : 'dark' }

type ViewKey = 'portfolio' | 'market' | 'avm' | 'land' | 'comps'
const currentView = ref<ViewKey>('portfolio')

const views: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: 'portfolio', label: 'Portfolio', icon: Home },
  { key: 'market', label: 'Market Map', icon: MapPinned },
  { key: 'avm', label: 'AVM Studio', icon: Calculator },
  { key: 'land', label: 'Land Bank', icon: LandPlot },
  { key: 'comps', label: 'Comparables', icon: BarChart3 },
]

const titles: Record<ViewKey, string> = {
  portfolio: 'Portfolio',
  market: 'Market Map',
  avm: 'AVM Studio',
  land: 'Land Bank',
  comps: 'Comparables',
}

const toasts = ref<{ id: number; msg: string; ok: boolean }[]>([])
let tid = 0
const notify = (msg: string, ok = true) => {
  const id = ++tid
  toasts.value.push({ id, msg, ok })
  setTimeout(() => (toasts.value = toasts.value.filter((t) => t.id !== id)), 3400)
}

const reindex = () => notify('AVM re-indexed against 214 comparables · confidence 93%')
</script>

<template>
  <div :class="theme === 'dark' ? 'dark' : 'light'" class="min-h-screen bg-[#f6f7fb] dark:bg-[#07070d] text-slate-900 dark:text-slate-100 font-sans transition-colors">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 hidden md:flex flex-col gap-5 p-5 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] sticky top-0 h-screen">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center"><Building2 :size="18" class="text-white" /></div>
          <div><p class="font-bold leading-tight">PropTech</p><p class="text-[11px] text-slate-400">Valuator</p></div>
        </div>
        <nav class="flex flex-col gap-1 text-sm">
          <button v-for="v in views" :key="v.key" @click="currentView = v.key"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors"
            :class="currentView === v.key ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-medium' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-200'">
            <component :is="v.icon" :size="16" /> {{ v.label }}
          </button>
        </nav>
        <div class="mt-auto rounded-xl bg-sky-500/10 border border-sky-500/20 p-3.5">
          <div class="flex items-center gap-2 text-sky-600 dark:text-sky-300"><Crown :size="14" /><p class="text-xs font-semibold">Private Capital</p></div>
          <p class="text-[11px] text-slate-400 mt-1">$4.2M deployed across 3 funds</p>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 p-5 md:p-7 pb-10">
        <header class="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2.5 flex-wrap">PropTech <span class="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Valuator</span>
              <span class="text-[11px] font-normal px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Live</span>
            </h1>
            <p class="text-sm text-slate-400 mt-1">Property analytics · AVM scoring · deal desk · {{ titles[currentView] }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="reindex" class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm hover:bg-slate-50 dark:hover:bg-white/10"><RefreshCw :size="15" /> Re-index</button>
            <button @click="toggleTheme" class="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors">{{ theme === 'dark' ? '☀️' : '🌙' }}</button>
          </div>
        </header>

        <!-- Mobile nav -->
        <nav class="md:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1 mb-4">
          <button v-for="v in views" :key="v.key" @click="currentView = v.key"
            class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] transition-colors"
            :class="currentView === v.key ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-medium border border-sky-500/20' : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'">
            <component :is="v.icon" :size="14" /> {{ v.label }}
          </button>
        </nav>

        <!-- View switch -->
        <transition name="view" mode="out-in">
          <PortfolioView v-if="currentView === 'portfolio'" key="portfolio" :notify="notify" />
          <MarketMapView v-else-if="currentView === 'market'" key="market" :notify="notify" />
          <AVMStudioView v-else-if="currentView === 'avm'" key="avm" :notify="notify" />
          <LandBankView v-else-if="currentView === 'land'" key="land" :notify="notify" />
          <ComparablesView v-else key="comps" :notify="notify" />
        </transition>
      </main>
    </div>

    <!-- Toasts -->
    <teleport to="body">
      <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id"
            :class="t.ok ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-200' : 'border-rose-500/40 text-rose-700 dark:text-rose-200'"
            class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white dark:bg-[#0d0d18] border text-sm shadow-2xl">
            <CheckCircle2 v-if="t.ok" :size="16" class="text-emerald-400" /><TriangleAlert v-else :size="16" class="text-rose-400" />{{ t.msg }}
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