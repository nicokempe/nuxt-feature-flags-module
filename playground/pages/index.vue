<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
    <div class="mx-auto max-w-5xl space-y-10">
      <h1 class="text-3xl font-bold text-emerald-400">
        🧪 Nuxt Feature Flags Playground
      </h1>

      <!-- Environment Info -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          Environment Info
        </h2>
        <p>
          <span class="text-neutral-400">Current Environment:</span>
          <code class="text-white">{{ env }}</code>
        </p>
        <p>
          <span class="text-neutral-400">Active Flags:</span>
          <code class="text-white">{{ listFlags().join(', ') }}</code>
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
          ❌ New unreleased system are currently disabled.
        </p>
      </div>

      <!-- v-feature Directive -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-emerald-300">
          🚀 Try a Beta Feature
        </h2>
        <button
          v-feature="'betaButton'"
          class="rounded-lg bg-emerald-600/80 backdrop-blur-sm text-white font-semibold py-2 px-4 hover:bg-emerald-500/90 transition-colors duration-200"
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
          class="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 transition-colors duration-200"
          @click="navigateToProtected"
        >
          Go to Protected Page
        </button>
        <p class="text-neutral-400 text-sm mt-2">
          Redirects to <code>/404</code> unless <code>'newSystem'</code> is active.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isEnabled, listFlags } = useFeatureFlag()
const env = useRuntimeConfig().public.featureFlags.environment

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
  description: 'A playground for Nuxt Feature Flags',
})
</script>
