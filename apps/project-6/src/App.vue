<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Shield, ShieldAlert, Fingerprint, Brain, Activity,
  AlertTriangle, Laptop, Smartphone, Globe, KeyRound, Users,
  ArrowRight, Server, Ban, CheckCircle2, Lock, RefreshCw, Radar, Clock,
} from 'lucide-vue-next'

const trustScore = ref(92)
const activeSessions = ref(1284)
const blockedAttempts = ref(37)
const mfaVerified = ref(99.2)
const anomalies = ref([
  { id: 1, level: 'high', title: 'Impossible Travel Detected', time: 'Just now', desc: 'Credential for m.vasquez@nexa.io used in Singapore and Frankfurt within 14 minutes. Session revoked and device quarantined.' },
  { id: 2, level: 'high', title: 'Brute-Force Pattern on VPN', time: '2m ago', desc: '12 failed MFA attempts against a privileged admin account from a single IP (45.132.x.x). Rate-limit tripped, gateway rule applied.' },
  { id: 3, level: 'med', title: 'Behavioral Deviation: Data Access', time: '8m ago', desc: 'k.lim@nexa.io downloaded 3x the normal volume of PII records. Confidence 78% — step-up auth required on next request.' },
  { id: 4, level: 'med', title: 'New Device Enrollment', time: '14m ago', desc: 'Unseen Windows 11 surface from Jakarta requested a session. Passkey ceremony completed; trust tier set to Low.' },
])

const sessions = ref([
  { id: 1, device: 'Windows 11 · Chrome', location: 'Singapore', ip: '103.75.42.18', risk: 12, verified: true, type: 'laptop' },
  { id: 2, device: 'iPhone 15 Pro', location: 'Singapore', ip: '103.75.42.22', risk: 24, verified: true, type: 'smartphone' },
  { id: 3, device: 'Linux Workstation', location: 'Jakarta, ID', ip: '36.89.120.7', risk: 58, verified: false, type: 'server' },
  { id: 4, device: 'macOS · Safari (Unknown)', location: 'Frankfurt, DE', ip: '45.132.65.201', risk: 91, verified: false, type: 'laptop' },
])

const blockedSessions = ref(new Set<number>())

const users = ref([
  { name: 'Maria Vasquez', role: 'Admin · Identity', mfa: 'Passkey + FIDO2', risk: 'Low', ok: true },
  { name: 'Kenji Lim', role: 'SRE · Payments', mfa: 'TOTP', risk: 'Med', ok: true },
  { name: 'Ayesha Rahman', role: 'Support · L1', mfa: 'SMS Fallback', risk: 'Med', ok: false },
  { name: 'Jonas Weber', role: 'Auditor', mfa: 'Passkey', risk: 'Low', ok: true },
])

const policies = ref([
  { name: 'MFA Mandatory', tier: 'P0 · Never trust', status: 'Enforced', on: true },
  { name: 'Session Risk Cap', tier: 'P1 · 8h rotate', status: 'Enforced', on: true },
  { name: 'Geofence: EU Data', tier: 'P1 · Region pin', status: 'Advisory', on: false },
  { name: 'Privilege Escalation', tier: 'P0 · Approver', status: 'Enforced', on: true },
])

const authRange = ref('24h')
const authBars = ref([38, 42, 35, 60, 78, 55, 47, 52, 90, 120, 105, 88, 96, 132, 118, 140, 168, 155, 128, 96, 74, 58, 46, 40])

const chartBars = computed(() => {
  if (authRange.value === '6h') return authBars.value.slice(0, 12)
  if (authRange.value === '7d') return [1180, 1340, 1050, 1490, 1270, 1120, 1380]
  return authBars.value
})

const scanning = ref(false)
const reEvaluating = ref(false)
const showPolicyDialog = ref(false)
const newPolicyName = ref('')
const newPolicyTier = ref('P2 · Standard')
const toasts = ref<{ id: number; msg: string; type: 'ok' | 'warn' | 'err' }[]>([])
let toastId = 0

const pushToast = (msg: string, type: 'ok' | 'warn' | 'err' = 'ok') => {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4200)
}

const runScan = () => {
  if (scanning.value) return
  scanning.value = true
  setTimeout(() => {
    scanning.value = false
    trustScore.value = Math.min(99, trustScore.value + Math.round(Math.random() * 3))
    pushToast('Identity scan complete — 1,284 sessions evaluated.', 'ok')
    if (Math.random() > 0.5) {
      anomalies.value.unshift({
        id: Date.now(),
        level: 'high',
        title: 'Scan Found Shadow Admin',
        time: 'Just now',
        desc: 'A dormant privileged account with no MFA was detected. Automatic remediation applied.'
      })
    }
  }, 2400)
}

const quarantineAnomaly = (id: number) => {
  anomalies.value = anomalies.value.filter(a => a.id !== id)
  blockedAttempts.value += 1
  pushToast('Identity quarantined and session revoked.', 'err')
}

const addPolicy = () => {
  const name = newPolicyName.value.trim()
  if (!name) return
  policies.value.push({ name, tier: newPolicyTier.value, status: 'Enforced', on: true })
  newPolicyName.value = ''
  newPolicyTier.value = 'P2 · Standard'
  showPolicyDialog.value = false
  pushToast(`Policy "${name}" enforced.`, 'ok')
}

const reEvaluate = () => {
  if (reEvaluating.value) return
  reEvaluating.value = true
  setTimeout(() => {
    reEvaluating.value = false
    users.value = users.value.map(u => ({
      ...u,
      risk: Math.random() > 0.25 ? 'Low' : 'Med',
      ok: Math.random() > 0.2,
    }))
    sessions.value = sessions.value.map(s => ({
      ...s,
      risk: Math.max(5, Math.min(99, s.risk + Math.round(Math.random() * 20) - 10)),
      verified: Math.random() > 0.15,
    }))
    trustScore.value = Math.max(55, Math.min(98, trustScore.value + Math.round(Math.random() * 8) - 4))
    pushToast('Identities re-evaluated — trust score updated.', 'ok')
  }, 1400)
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    const head = authBars.value.shift()
    if (head !== undefined) authBars.value.push(Math.floor(Math.random() * 90) + 30)

    activeSessions.value += Math.floor(Math.random() * 5) - 2
    if (Math.random() > 0.85) {
      blockedAttempts.value += 1
      anomalies.value.unshift({
        id: Date.now(),
        level: Math.random() > 0.5 ? 'med' : 'high',
        title: Math.random() > 0.5 ? 'Failed MFA Burst' : 'Suspicious Geolocation',
        time: 'Just now',
        desc: Math.random() > 0.5
          ? 'Multiple TOTP failures on a non-standard client. Identity challenged with passkey step-up.'
          : 'Login from a country with 0 prior activity (NL). Risk 87 — conditional access denied.'
      })
      anomalies.value = anomalies.value.slice(0, 8)
    }
  }, 2200)
})

onUnmounted(() => clearInterval(interval))

const removeAnomaly = (id: number) => {
  anomalies.value = anomalies.value.filter(a => a.id !== id)
}

const toggleBlock = (id: number) => {
  const next = new Set(blockedSessions.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  blockedSessions.value = next
}

const isBlocked = (id: number) => blockedSessions.value.has(id)

const riskColor = (risk: number) =>
  risk < 30 ? 'text-emerald-400' : risk < 70 ? 'text-amber-400' : 'text-red-400'

const riskBar = (risk: number) =>
  risk < 30 ? 'bg-emerald-400' : risk < 70 ? 'bg-amber-400' : 'bg-red-400'

const avatarGradients = [
  'from-emerald-500/40 to-teal-600/40 border-emerald-400/40',
  'from-cyan-500/40 to-blue-600/40 border-cyan-400/40',
  'from-violet-500/40 to-fuchsia-600/40 border-violet-400/40',
  'from-amber-500/40 to-orange-600/40 border-amber-400/40',
]

const ringOffset = computed(() => 2 * Math.PI * 68 * (1 - trustScore.value / 100))

const trustLabel = computed(() =>
  trustScore.value >= 85 ? 'Protected' : trustScore.value >= 60 ? 'Elevated' : 'Locked down'
)

const trustColor = computed(() =>
  trustScore.value >= 85 ? 'text-emerald-400' : trustScore.value >= 60 ? 'text-amber-400' : 'text-red-400'
)

const maxBar = computed(() => Math.max(...chartBars.value))

const deviceIcon = (type: string) => type === 'smartphone' ? Smartphone : type === 'server' ? Server : Laptop
</script>

<template>
  <div class="h-screen w-screen relative flex flex-col bg-[#050505] text-slate-300 overflow-hidden font-sans">
    <!-- Ambient background -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <div class="absolute inset-0 bg-grid"></div>
      <div class="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[130px] animate-blob"></div>
      <div class="absolute -bottom-48 -right-32 w-[560px] h-[560px] rounded-full bg-cyan-500/10 blur-[140px] animate-blob-slow"></div>
      <div class="absolute top-1/3 left-1/2 w-[420px] h-[420px] rounded-full bg-violet-500/10 blur-[130px] animate-blob"></div>
    </div>

    <header class="h-16 relative z-10 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="absolute inset-0 rounded-lg bg-emerald-500/50 blur-lg"></div>
          <div class="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center border border-emerald-300/40 shadow-[0_0_24px_rgba(16,185,129,0.4)]">
            <Shield class="w-6 h-6 text-black" />
          </div>
        </div>
        <div>
          <h1 class="font-bold text-white tracking-[0.15em] text-lg">SECUR<span class="text-emerald-400">EDGE</span> <span class="font-light">IDENTITY</span></h1>
          <p class="text-xs text-slate-500 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            Zero-Trust IAM · Continuous Verification
          </p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden md:flex items-center gap-2 text-sm">
          <Radar class="w-4 h-4 text-emerald-400" />
          <span class="text-emerald-300 font-medium">Trust Engine Live</span>
          <span class="text-slate-600">·</span>
          <span class="text-slate-400">{{ activeSessions.toLocaleString() }} sessions</span>
        </div>
        <div class="h-8 w-px bg-white/10"></div>
        <button
          @click="runScan"
          :disabled="scanning"
          class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 disabled:cursor-wait text-white text-sm font-semibold rounded-lg transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          <RefreshCw :class="['w-4 h-4', scanning ? 'animate-spin' : '']" /> {{ scanning ? 'Scanning...' : 'Run Identity Scan' }}
        </button>
      </div>
    </header>

    <main class="flex-1 relative z-10 flex gap-4 p-4 overflow-hidden">
      <!-- Left: Trust Score + Policies -->
      <aside class="w-80 flex flex-col gap-4 overflow-y-auto pr-1 custom-scroll">
        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg">
          <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
            <Brain class="w-4 h-4 text-emerald-400" /> Organizational Trust
          </h3>
          <div class="flex items-center justify-center py-1 relative">
            <div class="absolute w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl animate-pulse"></div>
            <div class="relative w-40 h-40">
              <svg viewBox="0 0 160 160" class="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="trustStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#34d399" />
                    <stop offset="100%" stop-color="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12" />
                <circle
                  cx="80" cy="80" r="68" fill="none" stroke="url(#trustStroke)" stroke-width="12" stroke-linecap="round"
                  stroke-dasharray="427.3" :stroke-dashoffset="ringOffset"
                  class="animate-ring"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold text-white drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">{{ trustScore }}</span>
                <span class="text-[11px] mt-1 font-medium tracking-wider" :class="trustColor">{{ trustLabel }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-4 pt-5 mt-4 border-t border-white/10">
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-500">Verified identities</span>
                <span class="text-white font-semibold">46,210</span>
              </div>
              <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[92%]"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-500">MFA coverage</span>
                <span class="text-white font-semibold">99.2%</span>
              </div>
              <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-400 w-[99%]"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-500">Compromised accounts</span>
                <span class="text-white font-semibold">12</span>
              </div>
              <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-500 to-rose-400 w-[17%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 flex-1 shadow-lg">
          <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Lock class="w-4 h-4 text-emerald-400" /> Access Policies
          </h3>
          <div class="space-y-3">
            <div
              v-for="p in policies"
              :key="p.name"
              class="group p-3 border border-white/10 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent hover:border-emerald-500/30 transition-colors"
            >
              <div class="flex justify-between items-start mb-1">
                <span class="text-sm text-white font-medium group-hover:text-emerald-200 transition-colors">{{ p.name }}</span>
                <span
                  :class="['text-[10px] font-bold rounded-full px-2 py-0.5', p.on ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-500']"
                >{{ p.status }}</span>
              </div>
              <p class="text-[11px] text-slate-500">{{ p.tier }}</p>
            </div>
          </div>
          <button
            @click="showPolicyDialog = true"
            class="mt-4 w-full py-2.5 border border-white/10 hover:border-emerald-500/50 text-emerald-300 text-xs font-semibold rounded-xl transition bg-emerald-500/5 hover:bg-emerald-500/10"
          >
            + New Policy
          </button>
        </div>
      </aside>

      <!-- Center: Threat feed + Analytics -->
      <section class="flex-1 flex flex-col gap-4 relative overflow-hidden">
        <div class="grid grid-cols-4 gap-3">
          <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-lg group hover:border-emerald-500/30 transition-colors">
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Active Sessions</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop class="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div class="text-2xl font-bold text-white">{{ activeSessions.toLocaleString() }}</div>
          </div>
          <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-lg group hover:border-red-500/30 transition-colors">
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Blocked Attempts</span>
              <div class="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ban class="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div class="text-2xl font-bold text-white">{{ blockedAttempts }}</div>
          </div>
          <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-lg group hover:border-cyan-500/30 transition-colors">
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>MFA Verified</span>
              <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fingerprint class="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div class="text-2xl font-bold text-white">{{ mfaVerified }}<span class="text-sm text-slate-500">%</span></div>
          </div>
          <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-lg group hover:border-amber-500/30 transition-colors">
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Active Threats</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert class="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div class="text-2xl font-bold text-amber-400">{{ anomalies.length }}</div>
          </div>
        </div>

        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 flex-1 flex flex-col shadow-lg relative overflow-hidden">
          <div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent top-0"></div>
          <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <AlertTriangle class="w-3.5 h-3.5 text-red-400" />
            </span>
            Behavioral Anomaly Detection
            <span class="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span> LIVE
            </span>
          </h3>
          <div class="flex-1 overflow-y-auto pr-2 custom-scroll relative">
            <div class="absolute left-0 right-0 h-px bg-emerald-400/30 shadow-[0_0_12px_rgba(52,211,153,0.6)] scan-line pointer-events-none"></div>
            <TransitionGroup name="list" tag="div" class="space-y-3">
              <div
                v-for="a in anomalies"
                :key="a.id"
                :class="[
                  'p-4 border rounded-xl cursor-pointer relative overflow-hidden transition-all backdrop-blur',
                  a.level === 'high'
                    ? 'bg-red-500/10 border-red-500/25 hover:bg-red-500/15 hover:shadow-[0_0_24px_rgba(239,68,68,0.15)]'
                    : 'bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/15 hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]'
                ]"
                @click="removeAnomaly(a.id)"
              >
                <div class="absolute left-0 top-0 bottom-0 w-1" :class="a.level === 'high' ? 'bg-gradient-to-b from-red-500 to-rose-600' : 'bg-gradient-to-b from-amber-400 to-orange-500'"></div>
                <div class="flex justify-between items-start mb-1.5 pl-2">
                  <span :class="['text-xs font-bold tracking-wide', a.level === 'high' ? 'text-red-400' : 'text-amber-400']">{{ a.title }}</span>
                  <span class="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock class="w-3 h-3" /> {{ a.time }}
                  </span>
                </div>
                <p class="text-sm text-slate-200 pl-2 leading-relaxed">{{ a.desc }}</p>
                <div v-if="a.level === 'high'" class="mt-2.5 pl-2">
                  <button
                    @click.stop="quarantineAnomaly(a.id)"
                    class="text-xs text-red-300 font-semibold flex items-center gap-1.5 hover:text-red-200 bg-red-500/15 border border-red-500/25 rounded-full px-3 py-1.5 transition"
                  >
                    Quarantine Identity <ArrowRight class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span class="w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Activity class="w-3.5 h-3.5 text-emerald-400" />
              </span>
              Authentication Volume
            </h3>
            <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-[11px]">
              <button
                v-for="r in ['6h', '24h', '7d']"
                :key="r"
                @click="authRange = r"
                :class="['px-3 py-1 rounded-full font-medium transition', authRange === r ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white']"
              >{{ r }}</button>
            </div>
          </div>
          <div class="flex items-end gap-1 h-[120px]">
            <div
              v-for="(v, i) in chartBars"
              :key="i"
              class="flex-1 rounded-t-sm transition-all duration-300 cursor-pointer relative group"
              :style="{ height: `${(v / maxBar) * 100}%`, background: i === chartBars.length - 1 ? 'linear-gradient(180deg,#34d399,#0d9488)' : 'linear-gradient(180deg,rgba(52,211,153,0.5),rgba(20,184,166,0.18))' }"
            >
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 backdrop-blur text-xs px-2.5 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-xl">
                {{ v }} logins
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Sessions + Users -->
      <aside class="w-96 flex flex-col gap-4 overflow-y-auto pr-1 custom-scroll">
        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg">
          <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
              <Globe class="w-3.5 h-3.5 text-cyan-400" />
            </span>
            Live Sessions
          </h3>
          <div class="space-y-3">
            <div
              v-for="s in sessions"
              :key="s.id"
              :class="['p-3.5 border rounded-xl transition-all backdrop-blur', isBlocked(s.id) ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20']"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <component :is="deviceIcon(s.type)" class="w-4 h-4" />
                  </span>
                  <span class="text-sm text-white font-medium">{{ s.device }}</span>
                </div>
                <span :class="['text-[10px] font-bold rounded-full px-2 py-0.5 bg-white/5 border border-white/10', riskColor(s.risk)]">
                  {{ s.risk }}% risk
                </span>
              </div>
              <p class="text-[11px] text-slate-500 mb-2.5">{{ s.location }} · {{ s.ip }}</p>
              <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                <div :class="['h-full rounded-full', riskBar(s.risk)]" :style="{ width: `${s.risk}%` }"></div>
              </div>
              <div class="flex items-center justify-between">
                <span :class="['flex items-center gap-1.5 text-[10px] font-medium', s.verified ? 'text-emerald-400' : 'text-amber-400']">
                  <CheckCircle2 v-if="s.verified" class="w-3.5 h-3.5" />
                  <KeyRound v-else class="w-3.5 h-3.5" />
                  {{ s.verified ? 'Verified' : 'Challenge Pending' }}
                </span>
                <button
                  @click="toggleBlock(s.id)"
                  :class="['text-[10px] font-semibold rounded-full px-3 py-1.5 transition', isBlocked(s.id) ? 'bg-red-500/25 text-red-300 border border-red-500/40' : 'border border-white/10 text-slate-400 hover:text-red-300 hover:border-red-500/40 bg-white/5']"
                >
                  {{ isBlocked(s.id) ? 'Session Blocked' : 'Block Session' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#0a0a0a]/70 backdrop-blur border border-white/10 rounded-2xl p-5 flex-1 shadow-lg">
          <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Users class="w-3.5 h-3.5 text-violet-400" />
            </span>
            High-Signal Identities
          </h3>
          <div class="space-y-2.5">
            <div v-for="(u, i) in users" :key="u.name" class="flex items-center gap-3 p-3 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
              <div :class="['w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white border', avatarGradients[i % avatarGradients.length]]">
                {{ u.name.split(' ').map(p => p[0]).join('') }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-white font-medium truncate">{{ u.name }}</div>
                <div class="text-[10px] text-slate-500">{{ u.role }}</div>
              </div>
              <div class="text-right">
                <span :class="['text-[10px] font-bold rounded-full px-2 py-0.5', u.ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400 border border-red-500/25']">
                  {{ u.risk }}
                </span>
                <div class="text-[9px] text-slate-600 mt-1">{{ u.mfa }}</div>
              </div>
            </div>
          </div>
          <button
            @click="reEvaluate"
            :disabled="reEvaluating"
            class="mt-4 w-full py-2.5 border border-white/10 hover:border-emerald-500/50 text-emerald-300 text-xs font-semibold rounded-xl transition bg-emerald-500/5 hover:bg-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw :class="['w-3.5 h-3.5', reEvaluating ? 'animate-spin' : '']" /> {{ reEvaluating ? 'Re-evaluating...' : 'Re-Evaluate All' }}
          </button>
        </div>
      </aside>
    </main>

    <!-- Toasts -->
    <div class="fixed top-20 right-5 z-50 flex flex-col gap-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'backdrop-blur border rounded-xl px-4 py-3 text-sm shadow-2xl flex items-start gap-2.5',
            t.type === 'ok' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100'
              : t.type === 'warn' ? 'bg-amber-500/15 border-amber-500/30 text-amber-100'
              : 'bg-red-500/15 border-red-500/30 text-red-100'
          ]"
        >
          <CheckCircle2 v-if="t.type === 'ok'" class="w-4 h-4 mt-0.5 shrink-0" />
          <AlertTriangle v-else-if="t.type === 'warn'" class="w-4 h-4 mt-0.5 shrink-0" />
          <Ban v-else class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ t.msg }}</span>
        </div>
      </TransitionGroup>
    </div>

    <!-- New Policy Dialog -->
    <div
      v-if="showPolicyDialog"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showPolicyDialog = false"
    >
      <div class="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Lock class="w-5 h-5 text-emerald-400" /> Create Access Policy
        </h3>
        <p class="text-sm text-slate-500 mb-5">Policies define when access must be challenged or denied.</p>
        <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Policy name</label>
        <input
          v-model="newPolicyName"
          type="text"
          placeholder="e.g. SSH Lockdown"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 mb-4"
          @keyup.enter="addPolicy"
        />
        <label class="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Trust tier</label>
        <div class="flex gap-2 mb-6">
          <button
            v-for="tier in ['P0 · Critical', 'P1 · Strict', 'P2 · Standard']"
            :key="tier"
            @click="newPolicyTier = tier"
            :class="['px-3 py-2 rounded-lg text-xs font-semibold border transition', newPolicyTier === tier ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white']"
          >{{ tier }}</button>
        </div>
        <div class="flex gap-3">
          <button
            @click="showPolicyDialog = false"
            class="flex-1 py-2.5 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition"
          >Cancel</button>
          <button
            @click="addPolicy"
            :disabled="!newPolicyName.trim()"
            class="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition"
          >Create Policy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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

.bg-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.15); }
  66% { transform: translate(-30px, 24px) scale(0.9); }
}
.animate-blob { animation: blob 14s ease-in-out infinite; }
.animate-blob-slow { animation: blob 20s ease-in-out infinite; }

@keyframes ringglow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(52,211,153,0.6)); }
  50% { filter: drop-shadow(0 0 14px rgba(52,211,153,0.9)); }
}
.animate-ring { animation: ringglow 3s ease-in-out infinite; }

@keyframes scan {
  0% { top: 0%; }
  100% { top: 100%; }
}
.scan-line { animation: scan 4s linear infinite; }

.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 9999px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.4); }
</style>