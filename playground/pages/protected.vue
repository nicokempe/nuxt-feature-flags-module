<template>
  <div class="min-h-screen p-12 text-white bg-neutral-950">
    <h2 class="text-2xl font-bold mb-4">
      🔐 Protected Feature Page
    </h2>
    <p>
      This page is protected by feature flag:
      <code class="text-emerald-400">newSystem</code>
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['feature-new-system'],
})
</script>
