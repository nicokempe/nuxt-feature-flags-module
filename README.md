[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Lightweight, environment-based feature flag system for Nuxt 3 — made for developers who need dynamic feature control in routes, components, and APIs.

## Features

- 🚫 Hide incomplete features in production environments to prevent accidental exposure
- 🧪 Enable alpha/beta features for staging, preview, or development environments
- 🔐 Limit access to specific APIs by feature flag in server handlers
- 🎯 Roll out features to internal QA teams without branching or releases

## Planned Features

- 🔄 Dynamic feature flag updates without server restarts through a remote config service (planned)
- 📆 Schedule feature launches for specific environments or timeframes (planned)
- 📊 A/B testing support for feature flags (planned)
- 📈 Analytics for feature flag usage (planned)
- 🧍‍♂️ Show features only for specific users (e.g., staff-only UIs, admin panels etc.) (planned)

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-feature-flags-module
```

That's it! You can now use Nuxt Feature Flags in your Nuxt app ✨


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


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-feature-flags-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-feature-flags-module

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-feature-flags-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-feature-flags-module

[license-src]: https://img.shields.io/npm/l/nuxt-feature-flags-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-feature-flags-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
