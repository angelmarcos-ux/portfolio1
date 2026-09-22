"use client";

import { useState } from "react";
import {
  Activity,
  Heart,
  Moon,
  Sun,
  Settings,
  Bell,
  Flame,
Home as HomeIcon,
  BarChart3,
  User,
  Footprints,
  Droplets,
  Sparkles,
  BedDouble,
  TrendingUp,
  Timer,
  Brain,
  ChevronRight,
  Target,
  BatteryCharging,
} from "lucide-react";
import { motion } from "framer-motion";

const HR_DATA = [58, 62, 66, 70, 74, 78, 76, 72, 68, 72, 79, 84, 88, 86, 90, 94, 98, 92, 84, 78, 74, 70, 66, 64];

const WEEK = [
  { day: "Mon", min: 42, kcal: 520 },
  { day: "Tue", min: 55, kcal: 610 },
  { day: "Wed", min: 38, kcal: 480 },
  { day: "Thu", min: 63, kcal: 720 },
  { day: "Fri", min: 47, kcal: 540 },
  { day: "Sat", min: 44, kcal: 490 },
  { day: "Sun", min: 58, kcal: 620 },
];

const SLEEP_STAGES = [
  { name: "Deep", hours: 2.3, color: "#6366f1" },
  { name: "REM", hours: 2, color: "#22d3ee" },
  { name: "Light", hours: 3.7, color: "#8b5cf6" },
  { name: "Awake", hours: 0.3, color: "#64748b" },
];

const INSIGHTS = [
  {
    icon: Moon,
    title: "Deep sleep +14% this week",
    body: "Optimal temperature regulation between 2AM–4AM correlates with your new magnesium protocol.",
    tag: "Sleep",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Heart,
    title: "Resting HR trending down",
    body: "48 bpm (3-day average) — improved cardiovascular recovery after your recovery runs.",
    tag: "Cardio",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Droplets,
    title: "Hydration below target",
    body: "Only 64oz logged. Your sleep model predicts +9% recovery with an extra 24oz before 6PM.",
    tag: "Hydration",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  color,
  spark,
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  unit: string;
  trend: string;
  color: string;
  spark: number[];
}) {
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const pts = spark
    .map((v, i) => `${(i / (spark.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`)
    .join(" ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${color} bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium">{label}</div>
            <div className="text-xl font-bold text-white">
              {value}
              <span className="text-xs font-medium text-slate-400 ml-1">{unit}</span>
            </div>
          </div>
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
          {trend}
        </span>
      </div>
      <svg viewBox="0 0 100 32" className="w-full h-8" preserveAspectRatio="none">
        <polyline
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400/70"
        />
      </svg>
    </motion.div>
  );
}

export default function Home() {
  const [range, setRange] = useState("24h");
  const [activeDay, setActiveDay] = useState(3);

  const hrMax = Math.max(...HR_DATA);
  const hrMin = Math.min(...HR_DATA);
  const hrSmooth = HR_DATA.map((v, i) => `${(i / (HR_DATA.length - 1)) * 600},${164 - ((v - hrMin) / (hrMax - hrMin || 1)) * 150}`).join(" ");
  const hrArea = `${hrSmooth} 600,164 0,164`;

  const sleepTotal = SLEEP_STAGES.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-black/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
            <Heart className="text-emerald-400 w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            Aura <span className="text-emerald-400 font-light">Health AI</span>
          </h1>
          <div className="hidden md:flex items-center gap-1 ml-6 bg-white/5 border border-white/10 rounded-full p-1 text-sm">
            {["Today", "Week", "Month"].map((t) => (
              <button
                key={t}
                className={`px-4 py-1.5 rounded-full font-medium transition ${
                  t === "Today" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
            <div className="w-full h-full bg-black rounded-full border border-black overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Good morning, Alex</h2>
            <p className="text-slate-400 text-sm mt-1">
              Your recovery is 94% — a great day to train hard.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Sunny, 24°C · Jakarta
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Heart} label="Heart Rate" value="72" unit="bpm" trend="+4%" color="text-rose-400" spark={[68, 66, 70, 74, 72, 78, 76, 72]} />
          <StatCard icon={Footprints} label="Steps" value="8,432" unit="/ 10k" trend="+18%" color="text-amber-400" spark={[1200, 3400, 2800, 5200, 6100, 7400, 8432]} />
          <StatCard icon={Flame} label="Active Energy" value="486" unit="kcal" trend="+9%" color="text-orange-400" spark={[180, 240, 310, 280, 410, 460, 486]} />
          <StatCard icon={Activity} label="HRV" value="82" unit="ms" trend="Balanced" color="text-violet-400" spark={[66, 72, 70, 78, 74, 80, 82]} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Heart Rate</h3>
                <p className="text-xs text-slate-500">Live · updated every second</p>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 text-xs">
                {["6h", "24h", "7d"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      range === r ? "bg-rose-500/20 text-rose-300" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold text-white">72</span>
              <span className="text-slate-400 font-medium">bpm</span>
              <span className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5 ml-2">
                Zone 2 · Fat burn
              </span>
            </div>
            <svg viewBox="0 0 600 164" className="w-full h-40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={hrArea} fill="url(#hrFill)" />
              <polyline
                points={hrSmooth}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {[14, 64, 114].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
              <span>12AM</span>
              <span>6AM</span>
              <span>12PM</span>
              <span>6PM</span>
              <span>Now</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col"
          >
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" /> Readiness
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - 0.94)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">94</span>
                  <span className="text-[11px] text-emerald-400 font-medium">Optimal</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              {[
                { label: "Resting HR", value: "48 bpm", good: true },
                { label: "Sleep quality", value: "8h 12m", good: true },
                { label: "Stress balance", value: "Elevated", good: false },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <span className="text-slate-400">{f.label}</span>
                  <span className={`font-semibold ${f.good ? "text-white" : "text-amber-300"}`}>{f.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="xl:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-300 font-semibold tracking-wider text-sm">AI SLEEP ANALYSIS</span>
              </div>
              <span className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                Last night · 8h 12m
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">
              Your deep sleep increased by 14% last night.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-2xl">
              On-device ML detected optimal body temperature regulation between 2AM and 4AM, correlating
              with the magnesium supplement protocol you started 3 days ago. Try to keep a consistent
              wake time to protect the gain.
            </p>

            <div className="mt-6">
              <div className="flex h-9 w-full rounded-full overflow-hidden bg-white/5">
                {SLEEP_STAGES.map((s) => (
                  <div key={s.name} style={{ width: `${(s.hours / sleepTotal) * 100}%`, backgroundColor: s.color }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                {SLEEP_STAGES.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-400">
                      {s.name} <span className="text-white font-semibold">{s.hours.toFixed(1)}h</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: BedDouble, label: "Time in bed", value: "8h 41m", color: "text-indigo-300" },
                { icon: Moon, label: "Fell asleep", value: "11:04 PM", color: "text-purple-300" },
                { icon: Sun, label: "Woke up", value: "7:16 AM", color: "text-amber-300" },
                { icon: Timer, label: "Efficiency", value: "94%", color: "text-emerald-300" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                  <div className="text-sm font-semibold text-white">{s.value}</div>
                  <div className="text-[11px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <h3 className="font-semibold text-white mb-6">Activity This Week</h3>
            <div className="flex items-end justify-between gap-2 h-40 mb-3">
              {WEEK.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.min / 65) * 130}px` }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    onClick={() => setActiveDay(i)}
                    className={`w-full rounded-lg transition-colors cursor-pointer ${
                      activeDay === i
                        ? "bg-emerald-400"
                        : "bg-emerald-500/25 group-hover:bg-emerald-500/40"
                    }`}
                  />
                  <span className={`text-[10px] ${activeDay === i ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-white">{WEEK[activeDay].min} min</span>
                  <span className="text-xs text-slate-500">goal 60 min</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (WEEK[activeDay].min / 60) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <BatteryCharging className="w-4 h-4 text-amber-400 mb-2" />
                <div className="text-lg font-bold text-white">3,142</div>
                <div className="text-[11px] text-slate-500">Active calories</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <TrendingUp className="w-4 h-4 text-cyan-400 mb-2" />
                <div className="text-lg font-bold text-white">11.4 km</div>
                <div className="text-[11px] text-slate-500">Distance this week</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> AI Insights
              </h3>
              <button className="text-xs text-emerald-300 hover:text-emerald-200 flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {INSIGHTS.map((insight, i) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`${insight.bg} border rounded-2xl p-4 flex gap-4 cursor-pointer hover:brightness-125 transition`}
                >
                  <div className={`${insight.color} bg-white/5 border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center shrink-0`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{insight.title}</span>
                      <span className="text-[10px] text-slate-500 bg-black/30 rounded-full px-2 py-0.5">{insight.tag}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{insight.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <h3 className="font-semibold text-white mb-6">Hydration</h3>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 144 144" className="w-full h-full -rotate-90">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - 0.64)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">64<span className="text-sm text-cyan-300 ml-0.5">oz</span></span>
                  <span className="text-[11px] text-slate-500 mt-0.5">of 100oz</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6 text-center">
              {[
                { label: "Water", value: "5 cups" },
                { label: "Tea", value: "2 cups" },
                { label: "Other", value: "1 cup" },
              ].map((d) => (
                <div key={d.label} className="bg-white/5 border border-white/10 rounded-xl py-3">
                  <div className="text-sm font-semibold text-white">{d.value}</div>
                  <div className="text-[10px] text-slate-500">{d.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="lg:hidden fixed bottom-0 inset-x-0 bg-black/70 backdrop-blur-xl border-t border-white/5 py-2 z-50">
        <div className="flex items-center justify-around text-slate-500">
          {[
            { icon: HomeIcon, label: "Home", active: true },
            { icon: Activity, label: "Activity", active: false },
            { icon: Moon, label: "Sleep", active: false },
            { icon: User, label: "Profile", active: false },
          ].map((t) => (
            <button key={t.label} className={`flex flex-col items-center gap-0.5 ${t.active ? "text-emerald-400" : ""}`}>
              <t.icon className="w-5 h-5" />
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>
      </footer>
      <div className="lg:hidden h-16" />
    </div>
  );
}