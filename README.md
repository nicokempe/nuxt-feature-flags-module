[![Nuxt banner](./.github/media/banner.svg)](https://github.com/nicokempe/nuxt-feature-flags-module)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads 18m][npm-downloads-18m-src]][npm-downloads-href]
[![License][license-src]][license-href]

Lightweight, environment-based feature flag system for Nuxt - made for developers who need dynamic feature control in routes, components, and APIs.

## Features

- 🚫 Hide incomplete features in production environments to prevent accidental exposure
- 🧪 Enable alpha/beta features for staging, preview, or development environments
- 🔐 Limit access to specific APIs by feature flag in server handlers
- 🎯 Roll out features to internal QA teams without branching or releases
- 📆 Schedule feature launches for specific environments or timeframes
- 🕵️‍♀️ Detect undeclared feature flags at build time with configurable validation and precise file context
- 🌳 Group flags with hierarchical names and enable bundles via wildcard (`*`) patterns

## Planned Features

- 📊 A/B testing support for feature flags
- 💡 Flag descriptions / metadata for better documentation, DevTools tooltips, or internal usage notes
- 🧩 Nuxt DevTools integration with a Feature Flag Explorer and Environment Switcher
- 🔄 Dynamic feature flag updates without server restarts through a remote config service
- 🧍‍♂️ Show features only for specific users (e.g., staff-only UIs, admin panels etc.)
- 🛠 Programmatic overrides to toggle or override feature flags dynamically at runtime (e.g., per user or session)
- 📈 Analytics for feature flag usage and user feedback collection

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-feature-flags-module
```

That's it! You can now use Nuxt Feature Flags in your Nuxt app ✨

Then define your feature flags in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags-module'],
  featureFlags: {
    environment: process.env.FEATURE_ENV || 'development',
    flagSets: {
      development: ['yourFeature1', 'yourFeature2', 'yourFeature3', 'yourFeature4'],
      staging: ['yourFeature1'],
      production: []
    }
  }
})
```

### Hierarchical & Wildcard Flags

Feature flags can be organized with `/`-separated paths and enabled in bulk using `*`.

```ts
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags-module'],
  featureFlags: {
    environment: process.env.FEATURE_ENV || 'development',
    flagSets: {
      development: [
        'solutions/*',
        'staging/*',
        'internal/experimental/ui'
      ],
      staging: [
        'solutions/company-portal/addons/sales',
        'solutions/company-portal/addons/marketing',
        'internal/experimental/ui'
      ],
      production: [
        'solutions/company-portal/addons/sales'
      ]
    }
  }
})
```

```ts
const { isEnabled } = useFeatureFlag()

if (isEnabled('solutions/company-portal/addons/sales')) {
  // sales addon enabled
}

if (isEnabled('solutions/*')) {
  // any solution-related flag is active
}
```

> [!CAUTION]  
> Using `*` enables every flag and the validator will emit a warning. Reserve it for debugging scenarios.

Use in your app:

```html
<template>
  <button v-feature="'yourFeature1'">Try Feature 1</button>
</template>
```

Or via composable:
```ts
const { isEnabled, listFlags } = useFeatureFlag()

if (isEnabled('yourFeature2')) {
  // do something
}

console.log(listFlags()) // returns ['yourFeature1', 'yourFeature2', 'yourFeature3', 'yourFeature4']
```

Or in your server API:
```ts
export default defineEventHandler((event) => {
  if (!isFeatureEnabled('yourFeature3', event)) {
    return sendError(event, createError({ statusCode: 403, message: 'Feature 3 is disabled' }))
  }

  return { message: 'Feature unlocked 🎉' }
})
```


Or guard entire pages via `definePageMeta`:

```html
<script lang="ts">
definePageMeta({
  featureFlag: 'yourFeature4',
  featureFallback: '/404',
  featureNotifyOnBlock: true,
})
</script>
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>


## License
This project is licensed under the [MIT License](https://github.com/nicokempe/nuxt-feature-flags-module/blob/main/LICENSE).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-feature-flags-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-feature-flags-module

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-feature-flags-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-feature-flags-module

[npm-downloads-18m-src]: https://img.shields.io/npm/d18m/nuxt-feature-flags-module.svg?style=flat&colorA=020420&colorB=00DC82

[license-src]: https://img.shields.io/npm/l/nuxt-feature-flags-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-feature-flags-module
