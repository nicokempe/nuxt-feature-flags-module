<template>
  <div>
    <div>basic</div>
    <p v-if="isEnabled('enabled')">
      Enabled feature
    </p>
    <p v-if="isEnabled('group/nested')">
      Wildcard feature
    </p>
    <p v-if="isEnabled('disabled')">
      Disabled feature
    </p>
  </div>
</template>

<script setup lang="ts">
import { useFeatureFlag } from '../../../src/runtime/composables/useFeatureFlag'

const { isEnabled } = useFeatureFlag()
</script>
