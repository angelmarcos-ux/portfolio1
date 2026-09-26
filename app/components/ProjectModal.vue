<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { X, ExternalLink, Github, Target, AlertTriangle, Sparkles, Cpu, Lightbulb } from 'lucide-vue-next'
import { projectDetails } from '~/data/projectDetails'

const props = defineProps({
  project: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const panel = ref(null)

const detail = () => (props.project ? projectDetails[props.project.folder] : null)

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.project,
  async (p) => {
    if (p) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      await nextTick()
      panel.value?.focus()
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project && detail()"
        class="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        :aria-label="`${project.title} details`"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" @click="emit('close')"></div>

        <!-- Panel -->
        <div
          ref="panel"
          tabindex="-1"
          class="relative w-full max-w-3xl my-auto rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl outline-none overflow-hidden"
        >
          <!-- Hero image -->
          <div class="relative aspect-video bg-slate-900">
            <img :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover opacity-70" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
            <button
              @click="emit('close')"
              class="absolute top-4 right-4 z-20 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-200 hover:bg-black/80 transition-colors"
              aria-label="Close details"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="absolute bottom-5 left-6 right-6">
              <span class="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                {{ project.category }}
              </span>
              <h3 class="text-3xl md:text-4xl font-bold text-white">{{ project.title }}</h3>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 md:p-8 space-y-7">
            <p class="text-slate-300 text-base leading-relaxed">{{ project.description }}</p>

            <!-- What it's for -->
            <section>
              <h4 class="flex items-center gap-2 text-white font-semibold mb-2.5">
                <Target class="w-4 h-4 text-blue-400" /> What it's for
              </h4>
              <p class="text-slate-400 text-sm leading-relaxed">{{ detail().purpose }}</p>
            </section>

            <!-- Problem -->
            <section class="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-4">
              <h4 class="flex items-center gap-2 text-amber-300 font-semibold mb-2.5">
                <AlertTriangle class="w-4 h-4" /> The problem it solves
              </h4>
              <p class="text-slate-300 text-sm leading-relaxed">{{ detail().problem }}</p>
            </section>

            <!-- Features -->
            <section>
              <h4 class="flex items-center gap-2 text-white font-semibold mb-3">
                <Sparkles class="w-4 h-4 text-emerald-400" /> Key capabilities
              </h4>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <li
                  v-for="f in detail().features"
                  :key="f"
                  class="flex items-start gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5"
                >
                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span class="text-slate-300 text-sm leading-snug">{{ f }}</span>
                </li>
              </ul>
            </section>

            <!-- Architecture -->
            <section>
              <h4 class="flex items-center gap-2 text-white font-semibold mb-2.5">
                <Cpu class="w-4 h-4 text-violet-400" /> How it's built
              </h4>
              <p class="text-slate-400 text-sm leading-relaxed">{{ detail().architecture }}</p>
            </section>

            <!-- Stack -->
            <section>
              <h4 class="flex items-center gap-2 text-white font-semibold mb-2.5">
                <Lightbulb class="w-4 h-4 text-amber-400" /> Stack
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300"
                >
                  {{ tag }}
                </span>
              </div>
            </section>

            <!-- Actions -->
            <footer class="pt-5 border-t border-white/10 flex flex-wrap items-center gap-4">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-blue-400 transition-colors"
              >
                Open live site <ExternalLink class="w-4 h-4" />
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors"
              >
                <Github class="w-4 h-4" /> Source code
              </a>
              <button
                @click="emit('close')"
                class="ml-auto px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from .relative {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
</style>
