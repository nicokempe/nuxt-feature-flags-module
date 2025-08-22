<template>
  <div class="min-h-screen p-12 text-white bg-neutral-950">
    <h2 class="text-2xl font-bold mb-4">
      🌳 Hierarchical Flags Demo
    </h2>
    <p class="mb-4">
      The <code class="text-emerald-400">solutions/*</code> wildcard enables all nested solution flags.
    </p>
    <ul class="space-y-2 list-disc pl-6">
      <li
        v-feature="'solutions/company-portal/addons/sales'"
        class="text-emerald-400"
      >
        Sales addon is enabled
      </li>
      <li
        v-feature="'solutions/company-portal/addons/marketing'"
        class="text-emerald-400"
      >
        Marketing addon is enabled
      </li>
      <li
        v-feature="'internal/experimental/ui'"
        class="text-emerald-400"
      >
        Internal experimental UI is enabled
      </li>
    </ul>
    <p
      v-if="isEnabled('solutions/*')"
      class="mt-6 text-emerald-400"
    >
      Group check for <code>solutions/*</code> returned true.
    </p>
  </div>
</template>

<script setup lang="ts">
const { isEnabled } = useFeatureFlag()

useSeoMeta({
  title: 'Nuxt Feature Flags Playground - Hierarchical Flags',
  description: 'Demonstrates hierarchical feature flags with wildcard bundling.',
})
</script>
