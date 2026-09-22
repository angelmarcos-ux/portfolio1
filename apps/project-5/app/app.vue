<script setup>
import { ref } from 'vue'
import { 
  ShoppingBag, Search, Menu, 
  ChevronRight, Play, ArrowUpRight, X, Trash2
} from 'lucide-vue-next'

const isCartOpen = ref(false)
const cartItems = ref([
  { id: 1, name: 'Obsidian Chronograph', price: 12450, qty: 1, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2015&auto=format&fit=crop' },
  { id: 2, name: 'Noir Eau de Parfum', price: 450, qty: 2, image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop' }
])

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.qty), 0)
})

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30">
    <!-- Navbar -->
    <nav class="absolute top-0 w-full z-50 px-8 py-6 flex items-center justify-between">
      <div class="flex items-center gap-12">
        <h1 class="text-2xl font-bold tracking-widest uppercase">AURA<span class="font-light">MAISON</span></h1>
        <div class="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold text-slate-300">
          <a href="#" class="hover:text-white transition">Collection</a>
          <a href="#" class="hover:text-white transition">Atelier</a>
          <a href="#" class="hover:text-white transition">Bespoke</a>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <Search class="w-5 h-5 cursor-pointer hover:text-amber-400 transition" />
        <div class="relative cursor-pointer group" @click="isCartOpen = true">
          <ShoppingBag class="w-5 h-5 group-hover:text-amber-400 transition" />
          <span v-if="cartItems.length > 0" class="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{{ cartItems.length }}</span>
        </div>
        <Menu class="w-6 h-6 md:hidden cursor-pointer" />
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="h-screen relative flex items-center justify-center overflow-hidden">
      <!-- Simulated 3D Background/Video -->
      <div class="absolute inset-0 bg-black">
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          class="w-full h-full object-cover opacity-60 scale-105 transform origin-center animate-[slowPan_30s_infinite_alternate]"
        />
      </div>

      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <p class="uppercase tracking-[0.3em] text-amber-400 text-sm mb-6 font-semibold">The Obsidian Collection</p>
        <h2 class="text-6xl md:text-8xl font-light tracking-tighter mb-8 leading-none">
          Redefining <br/> <span class="font-bold italic">Elegance.</span>
        </h2>
        <div class="flex items-center justify-center gap-6">
          <button class="px-8 py-4 bg-white text-black font-semibold uppercase tracking-wider text-sm hover:bg-amber-400 transition-colors">
            Explore Collection
          </button>
          <button class="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Play class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Products (Bento Grid) -->
    <section class="py-32 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div class="flex justify-between items-end mb-16">
        <h3 class="text-4xl font-light tracking-tight">Curated <span class="font-bold">Masterpieces</span></h3>
        <a href="#" class="hidden md:flex items-center gap-2 uppercase tracking-widest text-xs font-semibold text-amber-400 hover:text-amber-300">
          View All <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 grid-rows-[400px_400px] gap-4">
        <!-- Item 1 (Large) -->
        <div class="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-white/5 cursor-pointer" @click="isCartOpen = true">
          <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2015&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div class="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <p class="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">Limited Edition</p>
              <h4 class="text-3xl font-light">Obsidian Chronograph</h4>
            </div>
            <p class="text-xl font-mono">$12,450</p>
          </div>
          <div class="absolute top-8 right-8 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-amber-400 hover:text-black">
            <ShoppingBag class="w-5 h-5" />
          </div>
        </div>

        <!-- Item 2 -->
        <div class="md:col-span-2 relative group overflow-hidden bg-white/5 cursor-pointer">
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h4 class="text-xl font-light">Leather Weekender</h4>
            </div>
            <p class="text-lg font-mono">$3,200</p>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="relative group overflow-hidden bg-white/5 cursor-pointer">
          <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h4 class="text-lg font-light">Noir Eau de Parfum</h4>
            </div>
            <p class="text-base font-mono">$450</p>
          </div>
        </div>

        <!-- Item 4 -->
        <div class="relative group overflow-hidden bg-white/5 cursor-pointer">
          <div class="absolute inset-0 bg-amber-900/20 flex flex-col items-center justify-center p-8 text-center transition-colors group-hover:bg-amber-900/40">
            <h4 class="text-2xl font-light mb-4">Book a Private Fitting</h4>
            <div class="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors">
              <ChevronRight class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cart Drawer (Micro-interaction) -->
    <Transition name="slide">
      <div v-if="isCartOpen" class="fixed inset-0 z-[100] flex justify-end">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" @click="isCartOpen = false"></div>
        <div class="w-full md:w-[450px] bg-[#0a0a0a] h-full relative z-10 border-l border-white/10 flex flex-col shadow-2xl">
          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 class="text-xl font-light tracking-widest uppercase">Your Atelier <span class="font-bold">Cart</span></h3>
            <button @click="isCartOpen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div v-if="cartItems.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500">
              <ShoppingBag class="w-12 h-12 mb-4 opacity-50" />
              <p class="uppercase tracking-widest text-sm">Your cart is empty</p>
            </div>
            
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4 group">
              <div class="w-24 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="item.image" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 flex flex-col justify-center">
                <h4 class="font-medium text-sm mb-1">{{ item.name }}</h4>
                <p class="text-slate-400 text-xs mb-3">Qty: {{ item.qty }}</p>
                <p class="font-mono text-sm">${{ item.price.toLocaleString() }}</p>
              </div>
              <div class="flex items-center">
                <button @click="removeItem(item.id)" class="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-white/10 bg-black">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm text-slate-400 uppercase tracking-widest">Subtotal</span>
              <span class="text-xl font-mono">${{ cartTotal.toLocaleString() }}</span>
            </div>
            <button class="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@keyframes slowPan {
  from { transform: scale(1.05) translate(0, 0); }
  to { transform: scale(1.1) translate(-2%, 2%); }
}

/* Vue Transition for Cart Drawer */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from .bg-black\/60,
.slide-leave-to .bg-black\/60 {
  opacity: 0;
}
.slide-enter-from .w-full,
.slide-leave-to .w-full {
  transform: translateX(100%);
}
</style>