<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
    <div class="mx-auto max-w-5xl space-y-10">
      <!-- Promo Banner (Scheduled Feature) -->
      <div
        v-if="isEnabled('promoBanner')"
        class="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-white text-center py-4 px-6 rounded-xl shadow-lg border border-white/10"
      >
        🎉 Special Promo! This banner is only visible between May 16 – June 1, 2025.
      </div>

      <!-- Environment Info -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          Environment Info
        </h2>
        <p>
          <span class="text-neutral-400">Current Environment: </span>
          <code class="text-white ml-1">{{ env }}</code>
        </p>
        <p>
          <span class="text-neutral-400">Active Flags: </span>
          <code class="text-white ml-1">{{ listFlags().join(', ') }}</code>
        </p>
      </div>

      <!-- Feature Composable Demo -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          📊 New unreleased system
        </h2>
        <p
          v-if="isEnabled('newSystem')"
          class="text-green-400"
        >
          ✅ The <strong>New unreleased system</strong> feature is enabled.
        </p>
        <p
          v-else
          class="text-red-400"
        >
          ❌ New unreleased system is currently disabled.
        </p>
      </div>

      <!-- v-feature Directive -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          🚀 Try a Beta Feature
        </h2>
        <button
          v-feature="'betaButton'"
          class="rounded-lg bg-emerald-600/80 backdrop-blur-sm text-white font-semibold py-2 px-4 hover:opacity-80 transition ease-in-out duration-200 cursor-pointer"
          @click="showBetaModal = true"
        >
          Try the Beta Button
        </button>
        <p class="text-neutral-400 text-sm mt-2">
          Only visible when <code>'betaButton'</code> is active.
        </p>
      </div>

      <!-- Navigation Button -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          🔐 Route Guard Example
        </h2>
        <button
          class="rounded-lg bg-neutral-800 hover:opacity-80 text-white py-2 px-4 transition ease-in-out duration-200 cursor-pointer"
          @click="navigateToProtected"
        >
          Go to Protected Page
        </button>
        <p class="text-neutral-400 text-sm mt-2">
          Redirects to <code>/404</code> unless <code>'newSystem'</code> is active.
        </p>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showBetaModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-neutral-800 p-6 rounded-xl w-full max-w-md text-white border border-white/10 shadow-xl">
        <h3 class="text-xl font-semibold text-emerald-400 mb-4">
          ✨ Beta Feature Modal
        </h3>
        <p class="text-sm text-neutral-300 mb-6">
          This modal demonstrates how feature flags can conditionally trigger interactive components.
        </p>
        <div class="flex justify-end">
          <button
            class="bg-emerald-600 hover:opacity-80 text-white py-2 px-4 rounded transition duration-200 cursor-pointer"
            @click="showBetaModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isEnabled, listFlags } = useFeatureFlag()
const env = useRuntimeConfig().public.featureFlags.environment
const showBetaModal = ref(false)

function navigateToProtected() {
  if (isEnabled('newSystem')) {
    navigateTo('/protected')
  }
  else {
    navigateTo('/404')
  }
}

useSeoMeta({
  title: 'Nuxt Feature Flags Playground',
  description: 'A playground for the Nuxt Feature Flags Module. Test and explore feature flags in a Nuxt application.',
})
</script>

<style scoped>
code {
  word-break: break-word;
}
</style>
