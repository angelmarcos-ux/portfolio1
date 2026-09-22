<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Truck, Map, Globe, 
  Activity, Zap, AlertTriangle, ArrowRight 
} from 'lucide-vue-next'

const totalVehicles = ref(2481)
const onlinePct = ref(98)
const alerts = ref([
  { id: 1, type: 'high', title: 'High Risk: Weather', time: 'In 12h', desc: 'Typhoon approaching South China Sea. Rerouting 14 vessels recommended.' },
  { id: 2, type: 'med', title: 'Medium Risk: Port Congestion', time: 'In 48h', desc: 'Los Angeles port wait times exceeding 72 hours. Alternative: Long Beach.' }
])

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    // Simulate real-time data fluctuations
    totalVehicles.value += Math.floor(Math.random() * 5) - 2
    if (Math.random() > 0.8) {
      onlinePct.value = onlinePct.value === 98 ? 97 : 98
    }

    // Simulate incoming AI alerts
    if (Math.random() > 0.95 && alerts.value.length < 5) {
      alerts.value.unshift({
        id: Date.now(),
        type: Math.random() > 0.5 ? 'med' : 'high',
        title: 'Anomaly Detected',
        time: 'Just now',
        desc: 'Unexpected fuel consumption spike in EU Ground Fleet sector 7.'
      })
    }
  }, 2000)
})

onUnmounted(() => clearInterval(interval))

const removeAlert = (id: number) => {
  alerts.value = alerts.value.filter(a => a.id !== id)
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-[#050505] text-slate-300 overflow-hidden font-sans">
    <!-- Header -->
    <header class="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
          <Globe class="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 class="font-bold text-white tracking-wider text-lg">NEXUS<span class="text-purple-500">LOGISTICS</span> AI</h1>
          <p class="text-xs text-slate-500">Global Supply Chain Optimization Engine</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 text-sm">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-emerald-400 font-medium">Neural Engine Active</span>
        </div>
        <div class="h-8 w-px bg-white/10"></div>
        <button class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition">
          Generate Route Report
        </button>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 flex gap-4 p-4 overflow-hidden">
      <!-- Left Panel: Fleet Status -->
      <aside class="w-80 flex flex-col gap-4">
        <div class="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Truck class="w-4 h-4" /> Active Fleet Overview
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-3xl font-bold text-white transition-all">{{ totalVehicles.toLocaleString() }}</p>
                <p class="text-xs text-slate-500">Total Vehicles</p>
              </div>
              <div class="text-emerald-400 flex items-center gap-1 text-sm font-medium">
                <Activity class="w-4 h-4" /> {{ onlinePct }}% Online
              </div>
            </div>
            
            <div class="space-y-3 pt-4 border-t border-white/10">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">Trans-Pacific Freighters</span>
                  <span class="text-white font-medium">142</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 w-[70%]"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">EU Ground Transport</span>
                  <span class="text-white font-medium">1,830</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-purple-500 w-[95%]"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">Air Cargo (Global)</span>
                  <span class="text-white font-medium">84</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 w-[40%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 flex-1 flex flex-col">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle class="w-4 h-4" /> AI Risk Predictions
          </h3>
          <div class="flex-1 overflow-y-auto pr-2">
            <TransitionGroup name="list" tag="div" class="space-y-3">
              <div 
                v-for="alert in alerts" 
                :key="alert.id"
                :class="[
                  'p-3 border rounded-lg cursor-pointer transition-colors',
                  alert.type === 'high' ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
                ]"
                @click="removeAlert(alert.id)"
              >
                <div class="flex justify-between items-start mb-1">
                  <span :class="['text-xs font-bold', alert.type === 'high' ? 'text-red-400' : 'text-amber-400']">{{ alert.title }}</span>
                  <span :class="['text-[10px]', alert.type === 'high' ? 'text-red-500/70' : 'text-amber-500/70']">{{ alert.time }}</span>
                </div>
                <p class="text-sm text-white">{{ alert.desc }}</p>
                <button v-if="alert.type === 'high'" class="mt-2 text-xs text-red-400 font-medium flex items-center gap-1 hover:text-red-300">
                  Apply AI Reroute <ArrowRight class="w-3 h-3" />
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </aside>

      <!-- Center Panel: Map & Analytics -->
      <section class="flex-1 flex flex-col gap-4 relative">
        <!-- Main Map Area (Simulated) -->
        <div class="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center group cursor-crosshair">
          <div class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-cover opacity-20 filter invert sepia hue-rotate-180 saturate-200 brightness-50"></div>
          
          <!-- Simulated Map Nodes -->
          <div class="absolute top-[30%] left-[20%] w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse"></div>
          <div class="absolute top-[25%] left-[45%] w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
          <div class="absolute top-[40%] left-[75%] w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-bounce"></div>
          
          <!-- SVG Paths for Routes -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" style="filter: drop-shadow(0 0 8px rgba(168,85,247,0.5))">
            <path d="M 20% 30% Q 30% 10% 45% 25%" fill="transparent" stroke="#a855f7" stroke-width="2" stroke-dasharray="5,5" class="animate-[dash_20s_linear_infinite]" />
            <path d="M 45% 25% Q 60% 40% 75% 40%" fill="transparent" stroke="#3b82f6" stroke-width="2" opacity="0.6" />
          </svg>

          <div class="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 rounded-lg p-3">
            <h4 class="text-sm font-bold text-white flex items-center gap-2"><Map class="w-4 h-4 text-purple-400"/> Live Routing Overlay</h4>
            <div class="mt-2 flex gap-4 text-xs">
              <label class="flex items-center gap-1 text-slate-300"><input type="checkbox" checked class="accent-purple-500"> Sea Freight</label>
              <label class="flex items-center gap-1 text-slate-300"><input type="checkbox" checked class="accent-blue-500"> Air Freight</label>
            </div>
          </div>
        </div>

        <!-- Bottom Analytics -->
        <div class="h-48 bg-[#0a0a0a] border border-white/10 rounded-xl p-5 flex gap-6">
          <div class="flex-1">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap class="w-4 h-4" /> AI Efficiency Gains
            </h3>
            <div class="flex items-end gap-2 mt-4">
              <span class="text-4xl font-bold text-emerald-400">$2.4M</span>
              <span class="text-sm text-slate-500 mb-1">saved this week</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Route optimization has reduced total fuel consumption by 14.2% across the trans-atlantic fleet.</p>
          </div>
          <div class="w-px h-full bg-white/10"></div>
          <div class="flex-[2] flex flex-col">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Volume Throughput (24h)</h3>
            <div class="flex-1 flex items-end gap-1 mt-2">
              <!-- Simulated Bar Chart -->
              <div v-for="i in 24" :key="i" class="flex-1 bg-purple-500/20 hover:bg-purple-500/50 rounded-t-sm transition-all cursor-pointer relative group" :style="{ height: `${Math.random() * 80 + 20}%` }">
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  {{ Math.floor(Math.random() * 5000) }} TEU
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
@keyframes dash {
  to {
    stroke-dashoffset: -1000;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>