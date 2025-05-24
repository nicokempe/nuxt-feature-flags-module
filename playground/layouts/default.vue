<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100">
    <header class="bg-neutral-900 border-b border-neutral-800 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="text-xl font-semibold text-emerald-400"
        >🧪 Feature Flags Playground</NuxtLink>

        <!-- Mobile Toggle Button -->
        <button
          class="sm:hidden text-neutral-300 hover:text-emerald-400 transition cursor-pointer"
          aria-label="Toggle Navigation"
          @click="isOpen = !isOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
            />
          </svg>
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden sm:flex space-x-4 text-sm">
          <NuxtLink
            to="/"
            class="hover:text-emerald-400 transition-colors"
          >Home</NuxtLink>
          <NuxtLink
            to="/scheduled"
            class="hover:text-emerald-400 transition-colors"
          >Scheduled</NuxtLink>
          <NuxtLink
            v-feature="'newSystem'"
            to="/protected"
            class="hover:text-emerald-400 transition-colors"
          >Protected</NuxtLink>
        </nav>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isOpen"
        class="sm:hidden px-6 pb-4 space-y-2 text-sm"
      >
        <NuxtLink
          to="/"
          class="block hover:text-emerald-400 transition-colors"
        >Home</NuxtLink>
        <NuxtLink
          to="/scheduled"
          class="block hover:text-emerald-400 transition-colors"
        >Scheduled</NuxtLink>
        <NuxtLink
          v-feature="'newSystem'"
          to="/protected"
          class="block hover:text-emerald-400 transition-colors"
        >Protected</NuxtLink>
      </div>
    </header>

    <main class="py-12 px-6 max-w-5xl mx-auto">
      <slot />
    </main>

    <footer class="mt-16 border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
      Made with 💚 by
      <NuxtLink
        to="https://www.nicokempe.de/"
        class="text-emerald-400 hover:opacity-80 transition ease-in-out duration-200"
      >
        Nico Kempe
      </NuxtLink>
      — <code>nuxt-feature-flags-module</code>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<style scoped>
a.router-link-active {
  color: #34d399; /* emerald-400 */
}
</style>
