<template>
  <div>
    <h2>This page is protected by feature flag: <code>feature-new-system</code></h2>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['feature-new-system'],
})
</script>
