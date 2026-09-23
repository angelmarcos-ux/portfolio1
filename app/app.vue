<template>
  <div class="relative min-h-screen bg-[#050505] text-slate-200 selection:bg-blue-500/30 font-sans overflow-hidden">
    <!-- Animated Background Blobs -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 glass border-b-0 border-white/5 py-4">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div class="text-xl font-bold tracking-tighter">
          <span class="text-white">J.</span>
          <span class="text-gradient">Dev</span>
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#expertise" class="hover:text-white transition-colors">Expertise</a>
          <a href="#projects" class="hover:text-white transition-colors">Projects</a>
          <a href="#contact" class="hover:text-white transition-colors">Contact</a>
        </div>
        <a href="#contact" class="px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all">
          Hire Me
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="relative z-10">
      
      <!-- Hero Section -->
      <section class="min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div class="max-w-4xl mx-auto text-center space-y-8" v-motion-fade-visible-once>
          
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Architecting Intelligence. <br/>
            <span class="text-gradient">Building the Future.</span>
          </h1>
          
          <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            I am a Fullstack Developer bridging the gap between <span class="text-white font-medium">Fullstack Web</span>, 
            <span class="text-white font-medium">Native Mobile</span>, and <span class="text-white font-medium">Machine Learning</span>. 
            Delivering scalable, high-performance systems for institutional-grade applications.
          </p>

          <div class="flex flex-wrap justify-center gap-4 pt-6">
            <a href="#projects" class="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2">
              View My Work <ArrowRight class="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" class="px-8 py-4 rounded-full glass border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
              <Github class="w-5 h-5" /> GitHub
            </a>
          </div>
        </div>

        <!-- Tech Stack Marquee (Static simulation for UI) -->
        <div class="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-white/5" v-motion-slide-visible-once-bottom>
          <p class="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">Mastering the Modern Stack</p>
          <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div class="flex items-center gap-2 font-bold text-xl"><MonitorSmartphone class="w-6 h-6"/> Next.js</div>
            <div class="flex items-center gap-2 font-bold text-xl"><Box class="w-6 h-6"/> Nuxt 3</div>
            <div class="flex items-center gap-2 font-bold text-xl"><Smartphone class="w-6 h-6"/> React Native</div>
            <div class="flex items-center gap-2 font-bold text-xl"><BrainCircuit class="w-6 h-6"/> PyTorch</div>
            <div class="flex items-center gap-2 font-bold text-xl"><Database class="w-6 h-6"/> PostgreSQL</div>
          </div>
        </div>
      </section>

      <!-- Expertise Section -->
      <section id="expertise" class="py-32 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="mb-16 md:mb-24" v-motion-fade-visible-once>
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Trifecta of <span class="text-gradient">Engineering</span></h2>
            <p class="text-slate-400 max-w-2xl text-lg">Deep domain expertise across three critical pillars of modern software, enabling me to build end-to-end intelligent products solo.</p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <!-- Fullstack -->
            <div class="glass-card p-8 group" v-motion-slide-visible-once-bottom>
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe class="w-7 h-7 text-blue-400" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Fullstack Web</h3>
              <p class="text-slate-400 mb-6 line-clamp-3">Building highly scalable, edge-rendered web applications with Next.js, Nuxt, and modern serverless architectures. Obsessed with Web Vitals and UX.</p>
              <ul class="space-y-2 text-sm text-slate-300 font-medium">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-blue-400"/> React & Vue Ecosystems</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-blue-400"/> Node.js, Go, Rust Backend</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-blue-400"/> Distributed DBs & Caching</li>
              </ul>
            </div>

            <!-- Mobile -->
            <div class="glass-card p-8 group" v-motion-slide-visible-once-bottom :delay="100">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone class="w-7 h-7 text-emerald-400" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Native Mobile</h3>
              <p class="text-slate-400 mb-6 line-clamp-3">Crafting fluid, 120fps mobile experiences for iOS and Android. Deep knowledge of React Native (JSI/Fabric), Swift, and Kotlin Multiplatform.</p>
              <ul class="space-y-2 text-sm text-slate-300 font-medium">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-400"/> React Native & Expo</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-400"/> Swift & SwiftUI</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-400"/> Offline-First Architectures</li>
              </ul>
            </div>

            <!-- ML -->
            <div class="glass-card p-8 group" v-motion-slide-visible-once-bottom :delay="200">
              <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain class="w-7 h-7 text-purple-400" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Machine Learning</h3>
              <p class="text-slate-400 mb-6 line-clamp-3">Deploying generative AI and predictive models to production. From fine-tuning LLMs to optimizing PyTorch models for edge inference.</p>
              <ul class="space-y-2 text-sm text-slate-300 font-medium">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-purple-400"/> LLMs & RAG Systems</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-purple-400"/> PyTorch & TensorFlow</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-purple-400"/> MLOps & Deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="py-32 px-6 bg-black/40 border-y border-white/5">
        <div class="max-w-7xl mx-auto">
          <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6" v-motion-fade-visible-once>
            <div>
              <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Featured <span class="text-gradient">Projects</span></h2>
              <p class="text-slate-400 max-w-xl text-lg">A selection of 25 enterprise-grade applications demonstrating my ability to ship complex products.</p>
            </div>
            <a href="https://github.com" target="_blank" class="text-white flex items-center gap-2 hover:text-blue-400 transition-colors font-medium">
              View all on GitHub <ArrowRight class="w-4 h-4" />
            </a>
          </div>

          <!-- Filter Buttons -->
          <div class="flex flex-wrap gap-4 mb-12 justify-start" v-motion-fade-visible-once>
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="activeCategory = cat"
              :class="[
                'px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border',
                activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(project, index) in filteredProjects" 
              :key="project.folder" 
              class="glass-card p-6 flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300"
              v-motion-slide-visible-once-bottom 
              :delay="(index % 3) * 100"
            >
              <div class="aspect-video bg-slate-900 rounded-xl overflow-hidden relative mb-6 group-hover:shadow-2xl transition-all duration-300">
                <img :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="px-3 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-2">
                    <Folder class="w-3 h-3 text-slate-300" />
                    <span class="font-mono text-[10px] text-slate-300 font-semibold tracking-wider">{{ project.folder }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex-grow">
                <div class="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-slate-300">
                  {{ project.category }}
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">{{ project.title }}</h3>
                <p class="text-slate-400 text-sm mb-6">{{ project.description }}</p>
              </div>
              
              <div class="mt-auto">
                <div class="flex flex-wrap gap-2 mb-6">
                  <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                    {{ tag }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <a :href="project.liveUrl || '#'" target="_blank" class="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-blue-400 transition-colors">
                    View Project <ExternalLink class="w-4 h-4" />
                  </a>
                  <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="inline-flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors">
                    <Github class="w-4 h-4" /> Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA / Contact -->
      <section id="contact" class="py-32 px-6 relative">
        <div class="max-w-4xl mx-auto text-center relative z-10" v-motion-fade-visible-once>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-8">Ready to scale your product?</h2>
          <p class="text-xl text-slate-400 mb-12">
            I'm currently accepting new opportunities. Whether you need a lead engineer, a technical co-founder, or an expert to architect your next big move.
          </p>
          <a href="mailto:hello@example.com" class="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black text-lg font-bold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Mail class="w-6 h-6" /> Let's Talk
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© {{ new Date().getFullYear() }} J.Dev. Built with Nuxt & Tailwind.</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ArrowRight, Github, MonitorSmartphone, Smartphone, 
  BrainCircuit, Database, Box, Globe, CheckCircle2, 
  Brain, ExternalLink, Mail, Folder 
} from 'lucide-vue-next'
import { projectsData } from '~/data/projects'

const activeCategory = ref('All')
const categories = ['All', 'Web', 'Mobile', 'Machine Learning']

const filteredProjects = computed(() => {
  if (activeCategory.value === 'All') return projectsData
  return projectsData.filter(p => p.type === activeCategory.value)
})
</script>

<style>
/* Global scrollbar styling for extra polish */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #050505;
}
::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #333;
}
html {
  scroll-behavior: smooth;
}
</style>
