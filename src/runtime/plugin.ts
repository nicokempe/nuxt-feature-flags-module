import { vFeature } from './directives/v-feature'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((_nuxtApp): void => {
  _nuxtApp.vueApp.directive('feature', vFeature)
})
