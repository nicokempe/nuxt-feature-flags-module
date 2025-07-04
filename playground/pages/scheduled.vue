<template>
  <div class="min-h-screen bg-neutral-950 text-white px-6 py-12">
    <div class="max-w-4xl mx-auto space-y-10">
      <h1 class="text-2xl font-bold mb-4">
        🕒 Scheduled Feature Flags
      </h1>

      <!-- Overview -->
      <div class="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg">
        <p>
          These flags use <code class="text-emerald-300">activeFrom</code> and <code class="text-emerald-300">activeUntil</code>
          to control when features are visible based on the current time.
        </p>
        <p class="text-neutral-400 mt-2 text-sm">
          Current time: <code class="text-white">{{ now }}</code>
        </p>
      </div>

      <!-- Flag List -->
      <div class="space-y-6">
        <div
          v-for="flag in scheduledFlags"
          :key="flag.name"
          class="bg-white/5 p-5 rounded-lg border border-white/10"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-semibold text-white">
                {{ flag.name }}
              </p>
              <p class="text-sm text-neutral-400">
                From: <code>{{ flag.activeFrom || 'N/A' }}</code> —
                Until: <code>{{ flag.activeUntil || 'N/A' }}</code>
              </p>
            </div>
            <div>
              <span
                v-if="isEnabled(flag.name)"
                class="bg-green-600/80 px-3 py-1 rounded text-sm font-medium"
              >
                ✅ Active
              </span>
              <span
                v-else
                class="bg-red-500/80 px-3 py-1 rounded text-sm font-medium"
              >
                ❌ Inactive
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Directive Test -->
      <div class="bg-white/10 p-6 rounded-xl border border-white/10">
        <h2 class="text-lg font-semibold text-emerald-300 mb-2">
          🎯 Directive-based rendering
        </h2>
        <p class="text-neutral-300 text-sm mb-3">
          Below is rendered using <code>v-feature="'scheduledFlagNow'"</code>.
        </p>
        <div
          v-feature="'scheduledFlagNow'"
          class="bg-emerald-600 px-4 py-2 rounded text-white font-semibold"
        >
          This banner is currently active by schedule ✅
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFeatureFlag, useRuntimeConfig } from '#imports'

const { isEnabled } = useFeatureFlag()
const now = new Date().toISOString()
const config = useRuntimeConfig().public.featureFlags

const scheduledFlags = computed(() => {
  const env = config.environment
  const flags = config.flagSets?.[env] || []

  return flags.filter((flag): flag is { name: string, activeFrom?: string, activeUntil?: string } => {
    return typeof flag === 'object' && typeof flag.name === 'string'
      && (typeof flag.activeFrom === 'string' || typeof flag.activeUntil === 'string')
  })
})

useSeoMeta({
  title: 'Nuxt Feature Flags Playground',
  description: 'A playground for the Nuxt Feature Flags Module. Test and explore feature flags in a Nuxt application.',
})
</script>
