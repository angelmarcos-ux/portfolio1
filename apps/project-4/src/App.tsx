import { useState, useEffect } from 'react';
import { 
  Car, Navigation, AlertOctagon, Activity, 
  Battery, Camera, Crosshair, Radar
} from 'lucide-react';

function App() {
  const [speed, setSpeed] = useState(68);
  const [lane, setLane] = useState(0); // -1 Left, 0 Center, 1 Right
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane(prev => Math.min(prev + 1, 1));
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        setSpeed(prev => Math.min(prev + 2, 85));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setSpeed(prev => Math.max(prev - 2, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(s => Math.max(0, s + (Math.random() > 0.5 ? 1 : -1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] overflow-hidden text-slate-200">
      {/* Top HUD Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <Car className="text-red-500 w-6 h-6" />
          <h1 className="font-bold tracking-widest text-lg">AUTOVISION <span className="text-red-500">EDGE</span></h1>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">PILOT:</span>
            <span className="text-emerald-400 font-bold tracking-wider animate-pulse">ENGAGED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">FPS:</span>
            <span className="font-mono">119.8</span>
          </div>
        </div>
      </header>

      {/* Main HUD */}
      <main className="flex-1 p-6 flex gap-6">
        {/* Left Panel: Telemetry */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Activity className="absolute top-4 left-4 w-4 h-4 text-slate-500" />
            <div className="text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {speed}
            </div>
            <div className="text-red-500 font-bold tracking-widest mt-2">MPH</div>
            <div className="w-full mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[68%] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            </div>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider mb-6 flex items-center gap-2">
              <Battery className="w-4 h-4" /> Power Train
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Main Battery</span>
                  <span className="font-mono">82%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[82%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Motor Temp</span>
                  <span className="font-mono text-amber-400">114°C</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Neural Compute Unit</span>
                  <span className="font-mono text-red-400">94%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel: Vision Stream */}
        <section className="flex-[2] bg-black border border-white/10 rounded-2xl relative overflow-hidden">
          {/* Simulated Road Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(239,68,68,0.1)_100%)]"></div>
          
          <div className="absolute bottom-0 w-full h-[50%] flex justify-center perspective-1000 overflow-hidden">
            {/* Lane Lines */}
            <div 
              className="w-[10%] h-full border-l-4 border-r-4 border-dashed border-emerald-500/50 transform origin-bottom rotate-x-[60deg] scale-y-[3] translate-y-[-50%] transition-transform duration-500"
              style={{ transform: `translateX(${lane * -200}%) rotateX(60deg) scaleY(3) translateY(-50%)` }}
            ></div>
          </div>

          {/* Bounding Boxes (Object Detection) */}
          <div className="absolute top-[40%] left-[30%] w-32 h-24 border-2 border-amber-500 bg-amber-500/10 rounded transition-transform duration-500" style={{ transform: `translateX(${lane * 50}px)` }}>
            <div className="absolute -top-6 left-0 bg-amber-500 text-black text-[10px] font-bold px-1 py-0.5">VEHICLE 98%</div>
          </div>
          <div className="absolute top-[45%] right-[20%] w-24 h-16 border-2 border-red-500 bg-red-500/10 rounded transition-transform duration-500" style={{ transform: `translateX(${lane * 50}px)` }}>
            <div className="absolute -top-6 left-0 bg-red-500 text-black text-[10px] font-bold px-1 py-0.5">VEHICLE 91%</div>
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1 bg-black/80 backdrop-blur rounded border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <Camera className="w-3 h-3" /> CAM_FRONT_CENTER
            </div>
            <div className="px-3 py-1 bg-black/80 backdrop-blur rounded border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <Radar className="w-3 h-3" /> LIDAR_ACTIVE
            </div>
          </div>

          <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/20" />
        </section>

        {/* Right Panel: Navigation & Alerts */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
            <Navigation className="w-12 h-12 text-blue-500 mb-4 transform -rotate-45" />
            <h3 className="text-xl font-bold text-white text-center">In 500 ft<br/>Merge Left</h3>
            <p className="text-sm text-slate-500 mt-2">I-80 Westbound</p>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider mb-4 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" /> System Logs
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="text-emerald-400">&gt; Lane centering active</div>
              <div className="text-emerald-400">&gt; Distance: 140ft holding</div>
              <div className="text-amber-400">&gt; WARN: Crosswind detected</div>
              <div className="text-emerald-400">&gt; Steering torque adjusted</div>
              <div className="text-slate-500">&gt; Cache flush complete</div>
              <div className="text-emerald-400">&gt; Sensor fusion stable</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
