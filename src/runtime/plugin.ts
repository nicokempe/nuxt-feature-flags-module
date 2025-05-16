import { vFeature } from './directives/v-feature'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((_nuxtApp): void => {
  console.log('Plugin injected by nuxt-feature-flags-module!')
  _nuxtApp.vueApp.directive('feature', vFeature)
})
