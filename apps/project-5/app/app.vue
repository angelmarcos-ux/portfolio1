<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ShoppingBag, Search, Menu, X, Trash2, Plus, Minus, ArrowRight, ArrowUpRight,
  Star, ChevronDown, Check, Sparkles, Truck, ShieldCheck, RotateCcw, Mail, Send, Instagram, Facebook, Play
} from 'lucide-vue-next'

const IMG = '?q=80&w=2000&auto=format&fit=crop'

const products = [
  { id: 1, name: 'Obsidian Chronograph', price: 12450, tag: 'Limited', cat: 'Timepieces', image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30${IMG}` },
  { id: 2, name: 'Noir Eau de Parfum', price: 450, tag: 'Icon', cat: 'Fragrance', image: `https://images.unsplash.com/photo-1541643600914-78b084683601${IMG}` },
  { id: 3, name: 'Leather Weekender', price: 3200, tag: '', cat: 'Leather', image: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62${IMG}` },
  { id: 4, name: 'Monogram Silk Scarf', price: 680, tag: 'New', cat: 'Ready-to-Wear', image: `https://images.unsplash.com/photo-1490481651871-ab68de25d43d${IMG}` },
  { id: 5, name: 'Riviera Sunglasses', price: 520, tag: 'New', cat: 'Ready-to-Wear', image: `https://images.unsplash.com/photo-1572635196237-14b3f281503f${IMG}` },
  { id: 6, name: 'Midnight Stiletto', price: 1150, tag: '', cat: 'Ready-to-Wear', image: `https://images.unsplash.com/photo-1543163521-1bf539c55dd2${IMG}` },
  { id: 7, name: 'Heritage Loafer', price: 890, tag: '', cat: 'Leather', image: `https://images.unsplash.com/photo-1560769629-975ec94e6a86${IMG}` },
  { id: 8, name: 'Cascade Diamond Earrings', price: 8900, tag: 'Limited', cat: 'Joaillerie', image: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a${IMG}` }
]

const categories = ['Timepieces', 'Fragrance', 'Leather', 'Joaillerie', 'Ready-to-Wear']

const activeFilter = ref('All')
const setFilter = (f) => { activeFilter.value = f }
const filteredProducts = computed(() =>
  activeFilter.value === 'All' ? products : products.filter(p => p.cat === activeFilter.value)
)

const featured = [products[0], products[7]]

const isCartOpen = ref(false)
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')

const cartItems = ref([
  { id: 1, name: 'Obsidian Chronograph', price: 12450, qty: 1, image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30${IMG}` },
  { id: 8, name: 'Cascade Diamond Earrings', price: 8900, qty: 1, image: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a${IMG}` }
])

const cartCount = computed(() => cartItems.value.reduce((t, i) => t + i.qty, 0))
const cartTotal = computed(() => cartItems.value.reduce((t, i) => t + (i.price * i.qty), 0))

const toast = ref('')
let toastTimer = null
const showToast = (msg) => {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2400)
}

const addToCart = (product) => {
  const found = cartItems.value.find(i => i.id === product.id)
  if (found) found.qty++
  else cartItems.value.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image })
  showToast(`${product.name} added to your atelier`)
}

const removeItem = (id) => { cartItems.value = cartItems.value.filter(i => i.id !== id) }

const changeQty = (id, delta) => {
  const item = cartItems.value.find(i => i.id === id)
  if (!item) return
  item.qty = Math.max(1, item.qty + delta)
}

const format = (n) => n.toLocaleString()

const isFittingOpen = ref(false)
const isArtisansOpen = ref(false)

const fitting = ref({ name: '', email: '', date: '' })

const bookFitting = () => {
  if (!fitting.value.name.trim() || !fitting.value.email.trim() || !fitting.value.date.trim()) {
    showToast('Please complete all fields to book your fitting')
    return
  }
  isFittingOpen.value = false
  fitting.value = { name: '', email: '', date: '' }
  showToast('Fitting requested — concierge will confirm within 24h')
}

const checkout = () => {
  isCartOpen.value = false
  showToast('Secure checkout is by invitation — concierge will reach out')
}

const artisans = [
  { name: 'Camille Laurent', role: 'Maison Horlogère', years: '23 yrs', bio: 'Master watchmaker behind the Obsidian Chronograph and every numbered timepiece.', img: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop` },
  { name: 'Sofia Marchetti', role: 'Nez de la Maison', years: '17 yrs', bio: 'The nose behind Noir and our archive of heritage fragrances.', img: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop` },
  { name: 'Étienne Beauvoir', role: 'Maître Maroquinier', years: '19 yrs', bio: 'Hand-cuts and saddle-stitches every leather piece, from weekender to loafer.', img: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop` },
  { name: 'Yuki Tanaka', role: 'Directeur Joaillerie', years: '21 yrs', bio: 'Sets every stone in the Cascade collection under a single loupe, by hand.', img: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop` }
]

const stats = [
  { value: 120, suffix: '+', label: 'Private Ateliers' },
  { value: 42, suffix: '', label: 'Countries Served' },
  { value: 15, suffix: 'yrs', label: 'Maison Legacy' }
]

const testimony = ref(0)
const testimonials = [
  { quote: 'The Obsidian Chronograph is a masterpiece — bespoke service from the first call to the final fitting.', author: 'Adrian Cole', role: 'Collector, Monaco' },
  { quote: 'Une maison beyond compare. Every piece arrives wrapped like a couture secret.', author: 'Élise Fontaine', role: 'Creative Director, Paris' },
  { quote: 'From private fittings to global delivery, AURAMAISON is flawless at every turn.', author: 'James Whitmore', role: 'CEO, London' }
]
let testimonialTimer = null

const nextTestimonial = () => { testimony.value = (testimony.value + 1) % testimonials.length }



const navLinks = [
  { label: 'Collection', href: '#collection' },
  { label: 'Masterpieces', href: '#masterpieces' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'Voices', href: '#voices' }
]

const onScroll = () => {
  isScrolled.value = window.scrollY > 40
}

let io = null
let statIo = null

const animateCount = (el) => {
  const target = Number(el.dataset.value || 0)
  const duration = 1400
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = Math.round(target * eased).toLocaleString()
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const revealHooks = () => {
  const els = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return }
  io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return
      const el = en.target
      el.classList.add('is-visible')
      el.querySelectorAll('.stat-value').forEach(animateCount)
      io.unobserve(el)
    })
  }, { threshold: 0.12 })
  els.forEach(el => io.observe(el))
}

const spyHooks = () => {
  const sections = document.querySelectorAll('section[id]')
  const secIo = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) activeSection.value = en.target.id
    })
  }, { rootMargin: '-45% 0px -50% 0px' })
  sections.forEach(s => secIo.observe(s))
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  revealHooks()
  spyHooks()
  testimonialTimer = setInterval(nextTestimonial, 6000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (io) io.disconnect()
  clearInterval(testimonialTimer)
  clearTimeout(toastTimer)
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white selection:bg-amber-500/40 font-sans overflow-x-hidden">
    <!-- ================= NAV ================= -->
    <nav :class="[
      'fixed top-0 w-full z-50 transition-all duration-500',
      isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
    ]">
      <div class="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-10">
          <a href="#top" class="logo-text text-2xl tracking-[0.18em] font-bold">AURA<span class="font-light text-amber-400">MAISON</span></a>
          <div class="hidden lg:flex items-center gap-8">
            <a v-for="link in navLinks" :key="link.href" :href="link.href"
               :class="['text-[11px] uppercase tracking-[0.25em] font-semibold transition-colors duration-300',
                        activeSection === link.href.slice(1) ? 'text-amber-400' : 'text-slate-400 hover:text-white']">
              {{ link.label }}
            </a>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <Search class="w-5 h-5 text-slate-300 cursor-pointer hover:text-amber-400 transition-colors" />
          <div class="relative cursor-pointer group" @click="isCartOpen = true">
            <ShoppingBag class="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors" />
            <Transition name="pop">
              <span v-if="cartCount > 0"
                    :key="cartCount"
                    class="cart-badge absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </Transition>
          </div>
          <button class="lg:hidden p-1" @click="isMenuOpen = true"><Menu class="w-6 h-6" /></button>
        </div>
      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition name="fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[90] lg:hidden">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="isMenuOpen = false"></div>
        <div class="absolute top-0 right-0 h-full w-72 bg-[#0a0a0a] border-l border-white/10 p-8 shadow-2xl">
          <div class="flex justify-end mb-10"><button @click="isMenuOpen = false"><X class="w-5 h-5" /></button></div>
          <div class="space-y-6">
            <a v-for="link in navLinks" :key="link.href" :href="link.href"
               @click="isMenuOpen = false"
               class="block text-sm uppercase tracking-[0.25em] text-slate-300 hover:text-amber-400 transition-colors">
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= HERO ================= -->
    <section id="top" class="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2400&auto=format&fit=crop"
             alt="Luxury fashion editorial"
             class="w-full h-full object-cover opacity-70 kenburns" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-[#050505]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent mix-blend-multiply"></div>
      </div>

      <!-- Floating decorative particles -->
      <div class="pointer-events-none absolute inset-0">
        <div v-for="i in 8" :key="i" class="particle" :style="{ left: (5 + i * 11) + '%', animationDelay: (i * 0.9) + 's' }"></div>
      </div>

      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div class="hero-item" style="animation-delay:0.1s">
          <p class="inline-flex items-center gap-2 uppercase tracking-[0.4em] text-amber-400 text-xs md:text-sm mb-8 font-semibold">
            <Sparkles class="w-4 h-4" /> The Obsidian Collection 2026
          </p>
        </div>
        <h1 class="hero-item text-6xl md:text-8xl font-light tracking-tight leading-[0.95] mb-8" style="animation-delay:0.25s">
          Redefining<br />
          <span class="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-shimmer">Elegance.</span>
        </h1>
        <p class="hero-item text-slate-300 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed" style="animation-delay:0.4s">
          Sculpted timepieces, couture leathers and rare fragrances — each piece, numbered and destined for you.
        </p>
        <div class="hero-item flex flex-wrap items-center justify-center gap-5" style="animation-delay:0.55s">
          <a href="#collection"
             class="btn-shine inline-flex items-center gap-2 px-9 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors duration-300">
            Explore Collection <ArrowRight class="w-4 h-4" />
          </a>
          <button class="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 group">
            <Play class="w-4 h-4 ml-1 group-hover:text-amber-400" />
          </button>
        </div>
      </div>

      <a href="#collection" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
        <span class="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown class="w-5 h-5 animate-bounce" />
      </a>
    </section>

    <!-- ================= MARQUEE ================= -->
    <div class="border-y border-white/5 bg-black/60 overflow-hidden py-4">
      <div class="marquee-track flex whitespace-nowrap">
        <div class="marquee-content flex items-center gap-8 pr-8">
          <span v-for="i in 6" :key="i">
            <span class="mx-4 inline-flex items-center gap-8 text-sm uppercase tracking-[0.3em] text-slate-400">
              <span class="text-amber-400">✦</span> Complimentary Worldwide Shipping
              <span class="text-amber-400">✦</span> Private Client Services
              <span class="text-amber-400">✦</span> Lifetime Concierge Care
              <span class="text-amber-400">✦</span> Bespoke Craftsmanship
            </span>
          </span>
        </div>
        <div class="marquee-content flex items-center gap-8 pr-8" aria-hidden="true">
          <span v-for="i in 6" :key="i">
            <span class="mx-4 inline-flex items-center gap-8 text-sm uppercase tracking-[0.3em] text-slate-400">
              <span class="text-amber-400">✦</span> Complimentary Worldwide Shipping
              <span class="text-amber-400">✦</span> Private Client Services
              <span class="text-amber-400">✦</span> Lifetime Concierge Care
              <span class="text-amber-400">✦</span> Bespoke Craftsmanship
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- ================= BENTO / MASTERPIECES ================= -->
    <section id="masterpieces" class="py-28 px-6 max-w-[1600px] mx-auto">
      <div class="flex justify-between items-end mb-14 reveal">
        <div>
          <p class="text-amber-400 text-xs uppercase tracking-[0.35em] mb-3 font-bold">Curated for Connoisseurs</p>
          <h2 class="text-4xl md:text-6xl font-light tracking-tight">Featured <span class="font-bold">Masterpieces</span></h2>
        </div>
        <a href="#collection" class="hidden md:flex items-center gap-2 uppercase tracking-widest text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
          View All <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-white/5 cursor-pointer card-focus reveal"
             @click="addToCart(featured[0])">
          <img :src="featured[0].image" alt="Obsidian Chronograph"
               class="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
          <div class="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <p class="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">{{ featured[0].tag }}</p>
              <h3 class="text-3xl font-light">{{ featured[0].name }}</h3>
            </div>
            <p class="text-xl font-mono">${{ format(featured[0].price) }}</p>
          </div>
          <div class="absolute top-6 right-6 translate-x-14 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-amber-400 hover:text-black">
            <ShoppingBag class="w-5 h-5" />
          </div>
        </div>

        <div class="relative group overflow-hidden bg-white/5 cursor-pointer card-focus reveal"
             @click="addToCart(featured[1])">
          <img :src="featured[1].image" alt="Cascade Diamond Earrings"
               class="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <p class="text-amber-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{{ featured[1].tag }}</p>
              <h3 class="text-xl font-light">{{ featured[1].name }}</h3>
            </div>
            <p class="text-lg font-mono">${{ format(featured[1].price) }}</p>
          </div>
        </div>

        <div class="relative group overflow-hidden bg-white/5 cursor-pointer card-focus reveal"
             @click="addToCart(products[1])">
          <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1600&auto=format&fit=crop"
               alt="Noir Eau de Parfum"
               class="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h3 class="text-lg font-light">Noir Eau de Parfum</h3>
            </div>
            <p class="text-base font-mono">$450</p>
          </div>
        </div>

        <div class="relative group overflow-hidden bg-amber-900/10 reveal cursor-pointer" role="button" tabindex="0"
             @click="isFittingOpen = true" @keydown.enter="isFittingOpen = true">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-colors group-hover:bg-amber-900/30">
            <ShoppingBag class="w-8 h-8 mb-4 text-amber-400" />
            <h3 class="text-2xl font-light mb-4">Book a Private Fitting</h3>
            <p class="text-sm text-slate-300 mb-6">90 minutes. Champagne. One-on-one with a Style Director.</p>
            <div class="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all">
              <ArrowRight class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= COLLECTION ================= -->
    <section id="collection" class="py-28 px-6 max-w-[1600px] mx-auto">
      <div class="mb-14 reveal">
        <p class="text-amber-400 text-xs uppercase tracking-[0.35em] mb-3 font-bold">The Collection</p>
        <h2 class="text-4xl md:text-6xl font-light tracking-tight">Aurora <span class="font-bold">2026</span></h2>
        <div class="mt-6 flex flex-wrap gap-3">
          <button @click="setFilter('All')"
                  :class="['px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] border transition-colors cursor-pointer', activeFilter === 'All' ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'text-slate-300 border-white/10 hover:border-amber-400 hover:text-amber-400']">
            All
          </button>
          <button v-for="tag in categories" :key="tag" @click="setFilter(tag)"
                  :class="['px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] border transition-colors cursor-pointer', activeFilter === tag ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'text-slate-300 border-white/10 hover:border-amber-400 hover:text-amber-400']">
            {{ tag }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <article v-for="(product, i) in filteredProducts" :key="product.id"
                 class="group relative bg-white/[0.02] border border-white/[0.06] overflow-hidden card-in"
                 :style="{ animationDelay: (i % 4) * 70 + 'ms' }">
          <div class="relative aspect-[3/4] overflow-hidden">
            <img :src="product.image" :alt="product.name" loading="lazy"
                 class="w-full h-full object-cover transition-transform duration-[1100ms] group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
            <span v-if="product.tag"
                  class="absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-amber-400 text-black">
              {{ product.tag }}
            </span>
            <div class="absolute inset-x-4 bottom-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <button @click.stop="addToCart(product)"
                      class="w-full py-3 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-amber-400 transition-colors">
                Add to Atelier
              </button>
            </div>
          </div>
          <div class="p-4 md:p-5">
            <h3 class="text-sm md:text-base font-medium text-slate-200 group-hover:text-white transition-colors">{{ product.name }}</h3>
            <div class="mt-1 flex items-center gap-2">
              <p class="font-mono text-sm text-amber-400">${{ format(product.price) }}</p>
              <Star v-for="s in 5" :key="s" class="w-3 h-3 text-amber-400/70 fill-current" />
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ================= STATS ================= -->
    <section class="py-24 border-y border-white/5 bg-black/40">
      <div class="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div v-for="(stat, i) in stats" :key="stat.label" class="reveal" :style="{ transitionDelay: i * 120 + 'ms' }">
          <p class="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">
            <span class="stat-value" :data-value="stat.value">0</span><span class="text-3xl">{{ stat.suffix }}</span>
          </p>
          <p class="mt-3 text-xs uppercase tracking-[0.3em] text-slate-400">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ================= ATELIER ================= -->
    <section id="atelier" class="py-28 px-6 max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div class="relative reveal">
        <div class="aspect-[4/5] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop"
               alt="Inside the atelier" class="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105" />
        </div>
        <div class="absolute -bottom-6 -right-6 bg-amber-400 text-black p-8 max-w-[260px] hidden md:block">
          <p class="text-4xl font-light mb-2">Est. 2011</p>
          <p class="text-[11px] uppercase tracking-[0.2em] font-semibold">Haute Maison · Paris</p>
        </div>
      </div>
      <div class="reveal">
        <p class="text-amber-400 text-xs uppercase tracking-[0.35em] mb-3 font-bold">Inside the Maison</p>
        <h2 class="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-8">
          Crafted by hand.<br /><span class="font-bold italic">Obsessed over detail.</span>
        </h2>
        <p class="text-slate-400 text-base md:text-lg leading-relaxed mb-10">
          Each piece passes through the hands of 14 artisans across three generations. We never mass-produce — only small runs of numbered pieces, delivered to the world's most discerning addresses.
        </p>
        <div class="space-y-5">
          <div v-for="feature in [
            { icon: 'truck', title: 'Same-Week Global Delivery', copy: 'Tax-clear concierge shipping to 42 countries.' },
            { icon: 'shield', title: 'Authenticity Guaranteed', copy: 'Every piece serialised and backed for life.' },
            { icon: 'rotate', title: 'Effortless Returns', copy: '60-day returns, no questions, no drama.' }
          ]" :key="feature.title" class="flex gap-5 items-start">
            <div class="w-12 h-12 flex items-center justify-center bg-white/[0.04] border border-white/10">
              <Truck v-if="feature.icon === 'truck'" class="w-5 h-5 text-amber-400" />
              <ShieldCheck v-else-if="feature.icon === 'shield'" class="w-5 h-5 text-amber-400" />
              <RotateCcw v-else class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">{{ feature.title }}</h4>
              <p class="text-sm text-slate-400">{{ feature.copy }}</p>
            </div>
          </div>
        </div>
        <div class="mt-10 flex flex-wrap gap-4">
          <a href="#collection" class="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors">
            Shop the Collection <ArrowRight class="w-4 h-4" />
          </a>
          <button @click="isArtisansOpen = true" class="px-8 py-4 border border-white/20 uppercase tracking-widest text-sm font-semibold hover:bg-white/10 transition-colors">
            Meet the Artisans
          </button>
        </div>
      </div>
    </section>

    <!-- ================= TESTIMONIALS ================= -->
    <section id="voices" class="py-28 px-6 bg-black/40 border-y border-white/5">
      <div class="max-w-3xl mx-auto text-center">
        <div class="reveal">
          <p class="text-amber-400 text-xs uppercase tracking-[0.35em] mb-3 font-bold">Voices of the Maison</p>
          <div class="inline-flex gap-1 mb-8">
            <Star v-for="s in 5" :key="s" class="w-5 h-5 text-amber-400 fill-current" />
          </div>
        </div>
        <Transition name="fade" mode="out-in">
          <div :key="testimony" class="min-h-[180px] md:min-h-[140px] flex flex-col items-center justify-center">
            <p class="text-xl md:text-3xl font-light leading-relaxed mb-8">"{{ testimonials[testimony].quote }}"</p>
            <p class="font-semibold tracking-wide">{{ testimonials[testimony].author }}</p>
            <p class="text-sm text-slate-400 mt-1">{{ testimonials[testimony].role }}</p>
          </div>
        </Transition>
        <div class="flex justify-center gap-2 mt-8">
          <button v-for="(t, i) in testimonials" :key="i" @click="testimony = i"
                  :class="['w-2 h-2 rounded-full transition-all duration-300', i === testimony ? 'bg-amber-400 w-6' : 'bg-white/20 hover:bg-white/50']"></button>
        </div>
      </div>
    </section>

    <!-- ================= NEWSLETTER ================= -->
    <section class="py-28 px-6">
      <div class="max-w-4xl mx-auto text-center reveal">
        <Mail class="w-10 h-10 text-amber-400 mx-auto mb-6" />
        <h2 class="text-4xl md:text-6xl font-light tracking-tight mb-4">Join the <span class="font-bold">Inner Circle</span></h2>
        <p class="text-slate-400 mb-10 max-w-xl mx-auto">Private previews, archive releases and fittings invitations — twice a month, never more.</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input type="email" placeholder="Your email address"
                 class="flex-1 bg-transparent border border-white/15 px-5 py-4 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-500" />
          <button @click="showToast('Welcome to the Inner Circle ✦')"
                  class="btn-shine inline-flex items-center justify-center gap-2 px-7 py-4 bg-amber-400 text-black text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors">
            Subscribe <Send class="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>

    <!-- ================= FOOTER ================= -->
    <footer class="border-t border-white/5 py-16 px-6">
      <div class="max-w-[1600px] mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <p class="logo-text text-xl tracking-[0.18em] font-bold mb-4">AURA<span class="font-light text-amber-400">MAISON</span></p>
          <p class="text-sm text-slate-500 leading-relaxed">Paris · New York · Dubai. Numbered luxury objects, crafted in small runs since 2011.</p>
          <div class="flex gap-4 mt-6">
            <a href="#" class="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram class="w-4 h-4" /></a>
            <a href="#" class="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook class="w-4 h-4" /></a>
            <a href="#" class="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><Send class="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <h5 class="text-[11px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-5">Maison</h5>
          <ul class="space-y-3 text-sm text-slate-400">
            <li><a href="#" class="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Ateliers</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Sustainability</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-[11px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-5">Client Care</h5>
          <ul class="space-y-3 text-sm text-slate-400">
            <li><a href="#" class="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Repairs & Maintenance</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Private Shopping</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Contact Concierge</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-[11px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-5">Flagship</h5>
          <p class="text-sm text-slate-400">12 Avenue Montaigne<br />75008 Paris, France</p>
          <p class="text-sm text-slate-400 mt-4">concierge@auramaison.com</p>
        </div>
      </div>
      <div class="max-w-[1600px] mx-auto mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
        <p>© {{ new Date().getFullYear() }} AURAMAISON. Numbered objects for discerning clients.</p>
        <div class="flex gap-6 mt-3 md:mt-0">
          <a href="#" class="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" class="hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" class="hover:text-slate-300 transition-colors">Cookies</a>
        </div>
      </div>
    </footer>

    <!-- ================= CART DRAWER ================= -->
    <Transition name="slide">
      <div v-if="isCartOpen" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" @click="isCartOpen = false"></div>
        <div class="absolute right-0 top-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl">
          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 class="text-xl font-light tracking-widest uppercase">Your Atelier <span class="font-bold text-amber-400">Cart</span></h3>
            <button @click="isCartOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors"><X class="w-5 h-5" /></button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div v-if="cartItems.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500">
              <ShoppingBag class="w-12 h-12 mb-4 opacity-50" />
              <p class="uppercase tracking-widest text-sm">Your cart is empty</p>
              <button @click="isCartOpen = false" class="mt-6 btn-shine px-6 py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-amber-400 transition-colors">Continue Shopping</button>
            </div>

            <TransitionGroup name="list" tag="div" class="space-y-6">
              <div v-for="item in cartItems" :key="item.id" class="flex gap-4 group">
                <div class="w-24 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 class="font-medium text-sm mb-1">{{ item.name }}</h4>
                    <p class="font-mono text-sm text-amber-400">${{ format(item.price) }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <button @click="changeQty(item.id, -1)" class="w-7 h-7 border border-white/15 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors"><Minus class="w-3 h-3" /></button>
                    <span class="text-sm font-medium w-5 text-center">{{ item.qty }}</span>
                    <button @click="changeQty(item.id, 1)" class="w-7 h-7 border border-white/15 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors"><Plus class="w-3 h-3" /></button>
                  </div>
                </div>
                <button @click="removeItem(item.id)" class="self-start p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </TransitionGroup>
          </div>

          <div class="p-6 border-t border-white/10 bg-black">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-slate-400 uppercase tracking-widest">Subtotal</span>
              <span class="text-xl font-mono text-white">${{ format(cartTotal) }}</span>
            </div>
            <p class="text-xs text-slate-500 mb-6 flex items-center gap-2"><Check class="w-3 h-3 text-emerald-400" /> Complimentary shipping & duties included</p>
            <button @click="checkout" class="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= FITTING MODAL ================= -->
    <Transition name="fade">
      <div v-if="isFittingOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" @click="isFittingOpen = false"></div>
        <div class="relative w-full max-w-md bg-[#0b0b0b] border border-white/10 p-8 shadow-2xl">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-amber-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Private Client Service</p>
              <h3 class="text-2xl font-light tracking-wide">Book a <span class="font-bold">Private Fitting</span></h3>
            </div>
            <button @click="isFittingOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors"><X class="w-5 h-5" /></button>
          </div>
          <form class="space-y-5" @submit.prevent="bookFitting">
            <div>
              <label for="fit-name" class="block text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2">Full Name</label>
              <input id="fit-name" v-model="fitting.name" type="text" placeholder="Alexandre Dumas"
                     class="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-600" />
            </div>
            <div>
              <label for="fit-email" class="block text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2">Email</label>
              <input id="fit-email" v-model="fitting.email" type="email" placeholder="you@concierge.com"
                     class="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-600" />
            </div>
            <div>
              <label for="fit-date" class="block text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2">Preferred Date</label>
              <input id="fit-date" v-model="fitting.date" type="date"
                     class="w-full bg-transparent border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors [color-scheme:dark]" />
            </div>
            <button type="submit" class="w-full btn-shine bg-amber-400 text-black py-4 text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors">
              Request Fitting
            </button>
            <p class="text-center text-xs text-slate-500">90 minutes · Champagne · One-on-one with a Style Director</p>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ================= ARTISANS MODAL ================= -->
    <Transition name="fade">
      <div v-if="isArtisansOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" @click="isArtisansOpen = false"></div>
        <div class="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0b0b0b] border border-white/10 p-8 shadow-2xl">
          <div class="flex justify-between items-start mb-8">
            <div>
              <p class="text-amber-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">The Hands Behind the Maison</p>
              <h3 class="text-3xl font-light tracking-wide">Meet the <span class="font-bold">Artisans</span></h3>
            </div>
            <button @click="isArtisansOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors"><X class="w-5 h-5" /></button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div v-for="a in artisans" :key="a.name" class="group border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
              <div class="aspect-[4/3] overflow-hidden">
                <img :src="a.img" :alt="a.name" class="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              </div>
              <div class="p-5">
                <div class="flex justify-between items-baseline mb-1">
                  <h4 class="font-semibold tracking-wide">{{ a.name }}</h4>
                  <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500">{{ a.years }}</span>
                </div>
                <p class="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold mb-2">{{ a.role }}</p>
                <p class="text-sm text-slate-400 leading-relaxed">{{ a.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= TOAST ================= -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] bg-amber-400 text-black px-6 py-4 flex items-center gap-3 shadow-2xl">
        <Check class="w-4 h-4 font-bold" />
        <p class="text-sm font-semibold tracking-wide">{{ toast }}</p>
      </div>
    </Transition>
  </div>
</template>

<style>
/* ---------- keyframes ---------- */
@keyframes slowPan {
  from { transform: scale(1.05) translate(0, 0); }
  to { transform: scale(1.12) translate(-2%, 2%); }
}
.kenburns { animation: slowPan 28s ease-in-out infinite alternate; will-change: transform; }

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-shimmer {
  background-size: 200% 200%;
  animation: shimmer 5s ease-in-out infinite;
}

@keyframes marqueeMove {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marqueeMove 34s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(34px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-item { opacity: 0; animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes floatUp {
  0% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-46px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.6; }
}
.particle {
  position: absolute;
  bottom: 18%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(251, 191, 36, 0.5);
  filter: blur(1px);
  animation: floatUp 9s ease-in-out infinite;
}

/* button shine sweep */
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: '';
  position: absolute;
  top: 0; left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
  transform: skewX(-20deg);
  transition: none;
}
.btn-shine:hover::after { animation: shine 0.9s ease; }
@keyframes shine { to { left: 140%; } }

/* ---------- scroll reveal ---------- */
.reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); will-change: opacity, transform; }
.reveal.is-visible { opacity: 1; transform: none; }

/* ---------- collection card entrance (self-running, no IO dependency) ---------- */
.card-in { animation: cardIn 0.9s cubic-bezier(0.16,1,0.3,1) both; will-change: opacity, transform; }
@keyframes cardIn { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: none; } }

/* ---------- card hover lift ---------- */
.card-focus { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease; }
.card-focus:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -20px rgba(0,0,0,0.7); }

/* logo */
.logo-text { letter-spacing: 0.18em; }

/* ---------- cart badge pop ---------- */
.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { transform: scale(0); opacity: 0; }

/* ---------- cart drawer ---------- */
.slide-enter-active, .slide-leave-active { transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from .absolute.inset-0, .slide-leave-to .absolute.inset-0 { opacity: 0; }
.slide-enter-from .absolute.right-0, .slide-leave-to .absolute.right-0 { transform: translateX(100%); }

/* ---------- misc transitions ---------- */
.fade-enter-active, .fade-leave-active { transition: all 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(24px); }
.list-move { transition: transform 0.4s ease; }

.toast-enter-active { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translate(-50%, 24px); }
.toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }

@media (prefers-reduced-motion: reduce) {
  .kenburns, .animate-shimmer, .marquee-track, .particle, .hero-item, .card-in { animation: none; opacity: 1; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
</style>