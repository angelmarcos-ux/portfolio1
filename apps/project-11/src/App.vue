<template>
  <div class="min-h-screen bg-[#050505] text-slate-300 relative overflow-x-hidden">
    <!-- Ambient background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 blur-[130px]" />
      <div class="absolute top-1/2 -left-40 w-[480px] h-[480px] rounded-full bg-violet-500/10 blur-[130px]" />
      <div class="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div class="absolute inset-0" :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)' }" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl sticky top-0">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-[0_0_25px_rgba(217,70,239,0.5)]">
            <Radio class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-white font-bold text-lg leading-tight">Omni<span class="text-fuchsia-400">Stream</span> <span class="text-slate-500 font-medium text-sm">Media</span></h1>
            <p class="text-[11px] text-slate-500 font-mono">Edge-distributed transcoding · {{ regions }} edge regions · WebRTC</p>
          </div>
        </div>
        <div class="flex items-center gap-4 text-right">
          <div>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Global viewers</p>
            <p class="text-white font-bold font-mono text-sm">{{ totalViewers.toLocaleString() }} <span class="text-emerald-400">▲ live</span></p>
          </div>
          <button
            @click="openGoLive"
            class="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
          >
            <Video class="w-4 h-4" /> Go Live
          </button>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
      <!-- Stat row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="s in stats" :key="s.label" class="rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-4 hover:border-fuchsia-500/30 transition">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ s.label }}</p>
            <div :class="s.color"><component :is="s.icon" class="w-4 h-4" /></div>
          </div>
          <p class="text-2xl font-bold text-white font-mono">{{ s.value }}</p>
          <p class="text-xs mt-1" :class="s.trendClass">{{ s.trend }}</p>
        </div>
      </div>

      <!-- Channels grid -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tv class="w-4 h-4 text-fuchsia-400" /> Live Channels
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 font-mono ml-2">{{ liveCount }} on air</span>
          </h2>
          <button @click="refreshStreams" class="text-slate-500 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold">
            <RefreshCw :class="['w-3.5 h-3.5', refreshing ? 'animate-spin' : '']" /> Refresh
          </button>
        </div>

        <div v-if="channels.length === 0" class="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <MonitorPlay class="w-10 h-10 text-fuchsia-400/50 mx-auto mb-3" />
          <p class="text-slate-400 text-sm mb-4">No channels broadcasting yet.</p>
          <button @click="openGoLive" class="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-sm font-bold rounded-lg transition">Start your first stream</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="c in channels"
            :key="c.id"
            class="group rounded-2xl border border-white/8 bg-white/4 backdrop-blur overflow-hidden hover:border-fuchsia-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            <button class="relative w-full aspect-video overflow-hidden block" @click="openPlayer(c)">
              <div :class="['absolute inset-0 transition-transform duration-500 group-hover:scale-105', c.bg]" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <!-- equalizer bars animation -->
              <div class="absolute bottom-3 left-3 right-3 flex items-end gap-1 opacity-70">
                <span v-for="n in 24" :key="n" class="eq w-1 rounded-t-sm" :style="{ background: '#fff', animationDelay: `${(n % 12) * 0.12}s` }" />
              </div>
              <span v-if="c.live" class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </span>
              <span class="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-mono border border-white/10">{{ c.quality }}</span>
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span class="w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center">
                  <Play class="w-5 h-5 text-white ml-0.5" />
                </span>
              </span>
            </button>
            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-white font-bold text-sm truncate">{{ c.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ c.creator }} · {{ c.category }}</p>
                </div>
                <span class="shrink-0 text-xs font-mono text-slate-400 flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-1">
                  <Users class="w-3 h-3 text-emerald-400" /> {{ c.viewers.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-3">
                <p class="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Wifi class="w-3 h-3" /> {{ c.bitrate }} Mbps
                </p>
                <button
                  v-if="c.live"
                  @click="openPlayer(c)"
                  class="px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/25 text-fuchsia-300 text-xs font-semibold hover:bg-fuchsia-500/25 transition flex items-center gap-1.5"
                >
                  <Play class="w-3 h-3" /> Watch
                </button>
                <span v-else class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-500 text-xs font-semibold">Offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Transcoding nodes -->
      <section class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-5 rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server class="w-4 h-4 text-violet-400" /> Transcoding Nodes
            </h2>
            <button @click="toggleAllNodes" class="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition flex items-center gap-1">
              <Zap class="w-3.5 h-3.5" /> Toggle All
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="n in nodes" :key="n.id" class="rounded-xl border border-white/8 bg-white/3 p-3.5 flex items-center gap-3">
              <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', n.online ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-slate-500']">
                <Cpu class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs text-white font-semibold truncate">{{ n.name }}</p>
                  <span :class="['text-[10px] font-mono px-1.5 py-0.5 rounded border', n.online ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-500']">
                    {{ n.online ? 'online' : 'standby' }}
                  </span>
                </div>
                <p class="text-[10px] font-mono text-slate-600 mb-1.5">{{ n.region }} · {{ n.cpu }} CPU · {{ n.bw }} Gbps</p>
                <div class="h-1 rounded-full bg-white/8 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" :class="n.load > 82 ? 'bg-red-400' : n.load > 55 ? 'bg-amber-400' : 'bg-emerald-400'" :style="{ width: n.load + '%' }" />
                </div>
              </div>
              <button
                @click="toggleNode(n.id)"
                :class="['w-11 h-6 rounded-full relative transition shrink-0', n.online ? 'bg-emerald-500/70' : 'bg-white/10']"
                :title="n.online ? 'Take offline' : 'Bring online'"
              >
                <span :class="['absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all', n.online ? 'left-[22px]' : 'left-0.5']" />
              </button>
            </div>
          </div>
        </div>

        <!-- Stream health / activity -->
        <div class="lg:col-span-7 rounded-2xl border border-white/8 bg-white/4 backdrop-blur p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity class="w-4 h-4 text-cyan-400" /> Stream Telemetry
            </h2>
            <span :class="['text-[11px] px-2 py-0.5 rounded-full font-mono border', p99 < 120 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300']">
              p99 {{ p99 }}ms
            </span>
          </div>
          <div class="flex items-end gap-1 h-24 mb-5">
            <div
              v-for="(b, i) in latencySeries"
              :key="i"
              class="flex-1 rounded-t-sm"
              :style="{ height: `${(b / maxLat) * 100}%`, background: b > 140 ? 'linear-gradient(180deg,#f87171,#7f1d1d)' : b > 90 ? 'linear-gradient(180deg,#60a5fa,#1e3a8a)' : 'linear-gradient(180deg,#34d399,#065f46)' }"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-white/8 bg-white/3 p-3.5 flex items-center gap-3">
              <Globe class="w-4 h-4 text-cyan-300 shrink-0" />
              <div>
                <p class="text-[11px] text-slate-400">Nearest edge</p>
                <p class="text-sm text-white font-semibold">SIN · {{ globalLatency }}ms</p>
              </div>
            </div>
            <div class="rounded-xl border border-white/8 bg-white/3 p-3.5 flex items-center gap-3">
              <Signal class="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <p class="text-[11px] text-slate-400">Bitrate delivery</p>
                <p class="text-sm text-white font-semibold">{{ uplink }} / {{ downlink }} Mbps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-8 flex items-center justify-between flex-wrap gap-3 border-t border-white/5 pt-5">
        <p class="text-xs text-slate-600 font-mono flex items-center gap-2">
          <Signal class="w-3.5 h-3.5 text-fuchsia-400" /> {{ regions }} edge regions · {{ liveCount }} active broadcasts · Ultra-low latency mesh
        </p>
        <p class="text-xs text-slate-600 font-mono">WebRTC + WebTransport · ABR adaptive bitrate</p>
      </div>
    </main>

    <!-- Player modal -->
    <div v-if="player" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" @click.self="player = null">
      <div class="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="relative aspect-video">
          <div :class="['absolute inset-0', player.bg]" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div class="absolute inset-0 scan" />
          <div class="absolute bottom-4 left-4 flex items-end gap-1 opacity-80">
            <span v-for="n in 32" :key="n" class="eq w-1.5 rounded-t-sm" :style="{ background: '#fff', animationDelay: `${(n % 16) * 0.1}s` }" />
          </div>
          <span class="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-red-500 text-white text-xs font-bold tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </span>
          <span class="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs font-mono border border-white/10">{{ player.quality }}</span>
          <div class="absolute bottom-4 right-4 flex items-center gap-2">
            <button @click="stopStream" class="px-3 py-2 rounded-lg bg-red-500/85 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition">
              <Square class="w-3.5 h-3.5" /> End Stream
            </button>
            <button @click="player = null" class="w-9 h-9 rounded-lg bg-black/50 backdrop-blur border border-white/15 text-white flex items-center justify-center hover:bg-black/70 transition">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div>
              <p class="text-white font-bold text-lg">{{ player.title }}</p>
              <p class="text-sm text-slate-500">{{ player.creator }} · {{ player.category }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold font-mono text-emerald-400">{{ player.viewers.toLocaleString() }}</p>
              <p class="text-[11px] text-slate-500 uppercase tracking-wider">watching now</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2.5 text-center">
            <div class="rounded-xl border border-white/8 bg-white/3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1"><Clock class="w-3 h-3" /> Uptime</p>
              <p class="text-sm text-white font-mono">{{ uptime }}</p>
            </div>
            <div class="rounded-xl border border-white/8 bg-white/3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1"><Wifi class="w-3 h-3" /> Bitrate</p>
              <p class="text-sm text-white font-mono">{{ player.bitrate }} Mbps</p>
            </div>
            <div class="rounded-xl border border-white/8 bg-white/3 py-2.5">
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1"><Globe class="w-3 h-3" /> Edge</p>
              <p class="text-sm text-white font-mono">{{ player.edge }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Go Live modal -->
    <div v-if="showGoLive" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showGoLive = false">
      <div class="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Radio class="w-5 h-5 text-fuchsia-400" /> Start Broadcasting
        </h3>
        <p class="text-sm text-slate-500 mb-5">Your stream publishes to {{ regions }} edge regions globally.</p>
        <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Stream title</label>
        <input v-model="stream.title" type="text" placeholder="e.g. Midnight Set from the studio" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-fuchsia-500/50 mb-4" />
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Quality</label>
            <select v-model="stream.quality" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500/50">
              <option value="4K HDR">4K HDR</option>
              <option value="1080p60">1080p60</option>
              <option value="720p30">720p30</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Category</label>
            <select v-model="stream.category" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500/50">
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Tech Talk">Tech Talk</option>
              <option value="Art">Art</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showGoLive = false" class="flex-1 py-2.5 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition">Cancel</button>
          <button @click="startStream" :disabled="!stream.title.trim()" class="flex-1 py-2.5 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
            <Video class="w-4 h-4" /> Go Live
          </button>
        </div>
      </div>
    </div>

    <!-- Toasts -->
    <div class="fixed top-20 right-5 z-50 flex flex-col gap-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['backdrop-blur border rounded-xl px-4 py-3 text-sm shadow-2xl flex items-start gap-2.5',
            t.type === 'ok' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100'
            : t.type === 'err' ? 'bg-red-500/15 border-red-500/30 text-red-100'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-100']"
        >
          <CircleCheck v-if="t.type === 'ok'" class="w-4 h-4 mt-0.5 shrink-0" />
          <TriangleAlert v-else-if="t.type === 'warn'" class="w-4 h-4 mt-0.5 shrink-0" />
          <Ban v-else class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ t.msg }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Component } from 'vue'
import {
  Radio, Play, Square, Tv, Activity, Server, Globe, Users, MonitorPlay,
  Clock, Wifi, RefreshCw, CircleCheck, TriangleAlert, Signal, Zap, Video, Cpu, X, Ban, Gauge,
} from 'lucide-vue-next'

interface Channel {
  id: number
  title: string
  creator: string
  category: string
  viewers: number
  quality: string
  bitrate: number
  edge: string
  live: boolean
  bg: string
}

interface Node { id: number; name: string; region: string; cpu: number; bw: number; load: number; online: boolean }
interface Stat { label: string; value: string | number; trend: string; trendClass: string; color: string; icon: Component }

let chId = 100
const channels = ref<Channel[]>([
  { id: ++chId, title: 'Neon Drift — Night Ride', creator: 'kira.visuals', category: 'Music', viewers: 48231, quality: '1080p60', bitrate: 6.4, edge: 'SIN', live: true, bg: 'bg-gradient-to-br from-fuchsia-600 via-purple-700 to-slate-900' },
  { id: ++chId, title: 'Champions League Finals Radio', creator: 'arena.feed', category: 'Sports', viewers: 128904, quality: '4K HDR', bitrate: 18.2, edge: 'FRA', live: true, bg: 'bg-gradient-to-br from-cyan-500 via-blue-700 to-slate-900' },
  { id: ++chId, title: 'Late Night Coding w/ Misha', creator: 'misha.dev', category: 'Tech Talk', viewers: 8745, quality: '1080p60', bitrate: 5.9, edge: 'SIN', live: true, bg: 'bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-900' },
  { id: ++chId, title: 'Rooftop Jazz Sessions', creator: 'apex.audio', category: 'Music', viewers: 15603, quality: '720p30', bitrate: 4.1, edge: 'NYC', live: true, bg: 'bg-gradient-to-br from-amber-500 via-orange-700 to-slate-900' },
  { id: ++chId, title: 'Studio Spotlight — Offline', creator: 'orbital.fm', category: 'Music', viewers: 0, quality: '1080p60', bitrate: 0, edge: 'FRA', live: false, bg: 'bg-gradient-to-br from-slate-600 to-slate-900' },
])

const nodes = ref<Node[]>([
  { id: 1, name: 'node-sin-01', region: 'Singapore, SG', cpu: 62, bw: 40, load: 58, online: true },
  { id: 2, name: 'node-fra-02', region: 'Frankfurt, DE', cpu: 78, bw: 55, load: 74, online: true },
  { id: 3, name: 'node-nyc-03', region: 'New York, US', cpu: 54, bw: 32, load: 49, online: true },
  { id: 4, name: 'node-sao-04', region: 'São Paulo, BR', cpu: 91, bw: 24, load: 88, online: true },
  { id: 5, name: 'node-tyo-05', region: 'Tokyo, JP', cpu: 41, bw: 48, load: 35, online: true },
  { id: 6, name: 'node-syd-06', region: 'Sydney, AU', cpu: 33, bw: 18, load: 22, online: false },
])

const regions = 6
const globalLatency = ref(38)
const p99 = ref(96)
const uplink = ref(42)
const downlink = ref(680)
const latencySeries = ref([58, 64, 52, 70, 88, 76, 102, 95, 118, 84, 66, 92, 110, 96, 74, 63, 88, 122, 138, 116, 87, 79, 94, 106])
const maxLat = computed(() => Math.max(...latencySeries.value))

const player = ref<Channel | null>(null)
const showGoLive = ref(false)
const stream = ref({ title: '', quality: '1080p60', category: 'Music' })
const refreshing = ref(false)
const uptime = ref('00:00:00')
let upSec = 0

const toasts = ref<{ id: number; msg: string; type: 'ok' | 'warn' | 'err' }[]>([])
let toastSeq = 0

const liveCount = computed(() => channels.value.filter(c => c.live).length)
const totalViewers = computed(() => channels.value.reduce((a, c) => a + (c.live ? c.viewers : 0), 0))

const fmtViewers = (v: number) => (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(1) + 'k' : String(v))

const stats: Stat[] = [
  { label: 'Live Viewers', value: fmtViewers(totalViewers.value), trend: '+12.4% vs peak hour', trendClass: 'text-emerald-400', color: 'text-fuchsia-400', icon: Users },
  { label: 'Active Channels', value: liveCount.value, trend: '3 starting this hour', trendClass: 'text-emerald-400', color: 'text-violet-400', icon: Tv },
  { label: 'Transcoding Nodes', value: nodes.value.filter(n => n.online).length + ' / 6', trend: '1 on standby', trendClass: 'text-slate-400', color: 'text-cyan-400', icon: Server },
  { label: 'p99 Glass-to-Glass', value: p99.value + 'ms', trend: 'target < 120ms', trendClass: p99.value < 120 ? 'text-emerald-400' : 'text-amber-400', color: 'text-emerald-400', icon: Gauge },
]

const pushToast = (msg: string, type: 'ok' | 'warn' | 'err' = 'ok') => {
  const id = ++toastSeq
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4200)
}

const openPlayer = (c: Channel) => {
  if (!c.live) return
  player.value = c
  pushToast(`Now playing — ${c.title}.`, 'ok')
}

const startStream = () => {
  const t = stream.value.title.trim()
  if (!t) return
  channels.value.unshift({
    id: ++chId,
    title: t,
    creator: 'you',
    category: stream.value.category,
    viewers: Math.floor(Math.random() * 5000) + 1000,
    quality: stream.value.quality,
    bitrate: stream.value.quality === '4K HDR' ? 18.2 : stream.value.quality === '1080p60' ? 6.4 : 4.1,
    edge: 'SIN',
    live: true,
    bg: 'bg-gradient-to-br from-fuchsia-500 via-violet-700 to-cyan-700',
  })
  showGoLive.value = false
  pushToast(`You're live! "${t}" broadcasting on ${regions} edges.`, 'ok')
}

const stopStream = () => {
  if (!player.value) return
  const c = player.value
  c.live = false
  c.viewers = 0
  player.value = null
  pushToast(`Stream "${c.title}" ended. All edges released.`, 'err')
}

const toggleNode = (id: number) => {
  const n = nodes.value.find(x => x.id === id)!
  n.online = !n.online
  n.load = n.online ? 30 + Math.floor(Math.random() * 40) : 0
  pushToast(`${n.name} ${n.online ? 'back online' : 'placed on standby'}.`, n.online ? 'ok' : 'warn')
}

const toggleAllNodes = () => {
  const anyOnline = nodes.value.some(n => n.online)
  nodes.value.forEach(n => {
    n.online = !anyOnline
    n.load = !anyOnline ? 30 + Math.floor(Math.random() * 40) : 0
  })
  pushToast(anyOnline ? 'All nodes placed on standby.' : 'All nodes online.', anyOnline ? 'warn' : 'ok')
}

const refreshStreams = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    latencySeries.value.push(Math.floor(Math.random() * 60) + 50 + (Math.random() > 0.8 ? 60 : 0))
    latencySeries.value.shift()
    globalLatency.value = 32 + Math.floor(Math.random() * 12)
    pushToast('Stream telemetry refreshed.', 'ok')
  }, 800)
}

let ticker: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  ticker = setInterval(() => {
    channels.value.forEach(c => {
      if (c.live && Math.random() > 0.3) {
        c.viewers = Math.max(0, c.viewers + Math.floor(Math.random() * 400) - 80)
      }
    })
    nodes.value.forEach(n => {
      if (n.online) n.load = Math.min(99, Math.max(8, n.load + Math.floor(Math.random() * 12) - 6))
    })
    upSec += 1
    const h = String(Math.floor(upSec / 3600)).padStart(2, '0')
    const m = String(Math.floor((upSec % 3600) / 60)).padStart(2, '0')
    const s = String(upSec % 60).padStart(2, '0')
    uptime.value = `${h}:${m}:${s}`
  }, 2000)
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})

const openGoLive = () => {
  stream.value = { title: '', quality: '1080p60', category: 'Music' }
  showGoLive.value = true
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.eq {
  height: 40%;
  animation: eq 0.9s ease-in-out infinite;
  transform-origin: bottom;
}
@keyframes eq {
  0%, 100% { height: 20%; opacity: 0.45; }
  50% { height: 100%; opacity: 1; }
}

.scan {
  background: linear-gradient(180deg, transparent 45%, rgba(255, 255, 255, 0.08) 50%, transparent 55%);
  background-size: 100% 220%;
  animation: scan 3s linear infinite;
}
@keyframes scan {
  from { background-position: 0 0; }
  to { background-position: 0 -220%; }
}
</style>