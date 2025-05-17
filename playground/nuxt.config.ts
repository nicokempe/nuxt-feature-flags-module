export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  featureFlags: {
    environment: process.env.FEATURE_ENV || 'development',
    environments: {
      development: ['newSystem', 'betaButton'],
      staging: ['newSystem'],
      production: [],
    },
  },
})
