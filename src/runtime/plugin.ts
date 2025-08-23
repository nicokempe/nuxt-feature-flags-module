import { vFeature } from './directives/v-feature'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp): void => {
  nuxtApp.vueApp.directive('feature', vFeature)
})
