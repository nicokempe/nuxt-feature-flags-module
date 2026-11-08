import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  featureFlags: {
    environment: 'test',
    flagSets: {
      test: ['enabled', 'group/*'],
    },
    validation: { mode: 'disabled' },
  },
})
