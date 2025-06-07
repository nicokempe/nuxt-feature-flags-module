export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare_pages',
  },

  featureFlags: {
    environment: process.env.FEATURE_ENV || 'development',
    flagSets: {
      development: [
        'newSystem',
        'betaButton',
        {
          name: 'promoBanner',
          activeFrom: '2025-05-16T00:00:00Z',
          activeUntil: '2025-06-01T00:00:00Z',
        },
        'staticFlag',
        {
          name: 'scheduledFlagNow',
          activeFrom: '2025-01-01T00:00:00Z',
          activeUntil: '2099-01-01T00:00:00Z',
        },
        {
          name: 'scheduledFlagFuture',
          activeFrom: '2099-01-01T00:00:00Z',
          activeUntil: '2100-01-01T00:00:00Z',
        },
        {
          name: 'scheduledFlagPast',
          activeFrom: '2000-01-01T00:00:00Z',
          activeUntil: '2001-01-01T00:00:00Z',
        },
      ],
      staging: ['newSystem'],
      production: [],
    },
    validation: {
      mode: 'warn',
      includeGlobs: ['**/*.{vue,ts,js}'],
      excludeGlobs: ['node_modules', '.nuxt', 'dist'],
    },
  },
})
