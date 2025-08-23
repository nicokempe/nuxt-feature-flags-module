<template>
  <div class="min-h-screen bg-neutral-950 text-white px-6 py-12">
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold mb-4">
        🛠️ Server API Protection
      </h1>

      <div class="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg space-y-4">
        <h2 class="text-lg font-semibold text-emerald-300">
          /api/protected
        </h2>
        <button
          class="rounded-lg bg-neutral-800 hover:opacity-80 text-white py-2 px-4 transition cursor-pointer"
          @click="callProtected"
        >
          Call Endpoint
        </button>
        <p class="text-neutral-400 text-sm">
          Requires <code>betaButton</code> flag
        </p>
        <p
          v-if="protectedMessage"
          class="text-sm mt-2"
        >
          {{ protectedMessage }}
        </p>
      </div>

      <div class="bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg space-y-4">
        <h2 class="text-lg font-semibold text-emerald-300">
          /api/solutions
        </h2>
        <button
          class="rounded-lg bg-neutral-800 hover:opacity-80 text-white py-2 px-4 transition cursor-pointer"
          @click="callSales"
        >
          Call Endpoint
        </button>
        <p class="text-neutral-400 text-sm">
          Requires <code>solutions/company-portal/addons/sales</code> flag
        </p>
        <p
          v-if="salesMessage"
          class="text-sm mt-2"
        >
          {{ salesMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const protectedMessage = ref('')
const salesMessage = ref('')

async function callProtected() {
  protectedMessage.value = ''
  try {
    const res = await $fetch('/api/protected')
    protectedMessage.value = res.message
  }
  catch (err: unknown) {
    const e = err as { data?: { message?: string }, message?: string }
    protectedMessage.value = e.data?.message || e.message || String(err)
  }
}

async function callSales() {
  salesMessage.value = ''
  try {
    const res = await $fetch('/api/solutions')
    salesMessage.value = res.message
  }
  catch (err: unknown) {
    const e = err as { data?: { message?: string }, message?: string }
    salesMessage.value = e.data?.message || e.message || String(err)
  }
}

useSeoMeta({
  title: 'Nuxt Feature Flags Playground - Server API',
  description: 'Demonstrates protecting server API routes with feature flags.',
})
</script>
