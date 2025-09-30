# Changelog


## v2025.8.0...main

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/v2025.8.0...main)

### 🩹 Fixes

- **ci:** Provision pnpm with pnpm/action-setup and use frozen install ([74ded44](https://github.com/nicokempe/nuxt-feature-flags-module/commit/74ded44))
- **ci:** Enable Corepack and run scripts via pnpm in lint & test jobs ([a5ff075](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a5ff075))
- **ci:** Standardize pnpm setup with pnpm/action-setup and frozen installs ([569a0c0](https://github.com/nicokempe/nuxt-feature-flags-module/commit/569a0c0))

### 📖 Documentation

- **readme:** Update banner and add new module icon ([968c5e8](https://github.com/nicokempe/nuxt-feature-flags-module/commit/968c5e8))

### 🏡 Chore

- **pnpm:** Bump nuxt from 4.0.3 to 4.1.0 ([#83](https://github.com/nicokempe/nuxt-feature-flags-module/pull/83))
- **pnpm:** Bump eslint from 9.34.0 to 9.35.0 ([#89](https://github.com/nicokempe/nuxt-feature-flags-module/pull/89))
- **pnpm:** Bump vite from 7.1.3 to 7.1.5 in the npm_and_yarn group across 1 directory ([#90](https://github.com/nicokempe/nuxt-feature-flags-module/pull/90))
- **pnpm:** Bump @types/node from 24.3.1 to 24.5.2 ([#97](https://github.com/nicokempe/nuxt-feature-flags-module/pull/97))
- **github:** Update issue template copy-paste error ([00c7c05](https://github.com/nicokempe/nuxt-feature-flags-module/commit/00c7c05))
- **github:** Fix copy-paste error ([5084f9a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/5084f9a))
- **pnpm:** Bump @nuxt/devtools from 2.6.3 to 2.6.5 ([#99](https://github.com/nicokempe/nuxt-feature-flags-module/pull/99))
- **pnpm:** Bump @types/node from 24.5.2 to 24.6.0 ([#101](https://github.com/nicokempe/nuxt-feature-flags-module/pull/101))
- **actions:** Bump actions/setup-node@v4 to actions/setup-node@v5 ([2a0dca1](https://github.com/nicokempe/nuxt-feature-flags-module/commit/2a0dca1))
- **pnpm:** Update packages ([53937af](https://github.com/nicokempe/nuxt-feature-flags-module/commit/53937af))

### 🤖 CI

- **publish:** Improve publish script robustness ([8428cae](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8428cae))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))

## v2025.6.2...main

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/v2025.6.2...main)

### 🚀 Enhancements

- **#78:** Add hierarchical & wildcard feature flags ([#80](https://github.com/nicokempe/nuxt-feature-flags-module/pull/80))
- **playground:** Rebrand new-protected to meta-protected ([9fffa61](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9fffa61))
- **playground:** Add server page example ([3d4ab73](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3d4ab73))
- **playground:** Enhance homepage structure and add missing pages ([ed71243](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ed71243))
- **playground:** Add missing pages to the layout and extend footer content ([65ba5ea](https://github.com/nicokempe/nuxt-feature-flags-module/commit/65ba5ea))

### 🩹 Fixes

- **scripts:** Update improve version bump script ([c51db26](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c51db26))

### 💅 Refactors

- **middleware:** Expose defineFeatureFlagMiddleware as composable ([1a6e643](https://github.com/nicokempe/nuxt-feature-flags-module/commit/1a6e643))
- **readability:** Improve variable naming and readability across flags system ([83a0cbb](https://github.com/nicokempe/nuxt-feature-flags-module/commit/83a0cbb))

### 🏡 Chore

- **pnpm:** Bump typescript from 5.8.3 to 5.9.2 ([c86547d](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c86547d))
- **scripts:** Move bump-version script and remove .ts typos ([bee21c4](https://github.com/nicokempe/nuxt-feature-flags-module/commit/bee21c4))
- **pnpm:** Update packages ([1906068](https://github.com/nicokempe/nuxt-feature-flags-module/commit/1906068))
- **release:** V2025.9.0 ([3a79ba5](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3a79ba5))
- **release:** V2025.9.0" ([3bebe88](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3bebe88))

### 🤖 CI

- **release:** Automate version bumping in package.json ([0c68cca](https://github.com/nicokempe/nuxt-feature-flags-module/commit/0c68cca))
- **workflows:** Update Node.js version to 22 in CI configuration ([044d207](https://github.com/nicokempe/nuxt-feature-flags-module/commit/044d207))
- **package:** Improve package release ([0f5e9df](https://github.com/nicokempe/nuxt-feature-flags-module/commit/0f5e9df))
- **package:** Remove clean dependency for changelogen ([ac31da3](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ac31da3))
- **release:** Move inline publish logic into cross-platform script ([06cbcbd](https://github.com/nicokempe/nuxt-feature-flags-module/commit/06cbcbd))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))

## v2025.6.2

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/v2025.6.1...v2025.6.2)

### 🚀 Enhancements

- **middleware:** Add page-level feature flag protection via definePageMeta ([#77](https://github.com/nicokempe/nuxt-feature-flags-module/pull/77))

### 🩹 Fixes

- **package:** Update Git repository url from npm fix ([1b6e6f4](https://github.com/nicokempe/nuxt-feature-flags-module/commit/1b6e6f4))

### 💅 Refactors

- **config:** Rename `environments` to `flags` in feature flag configuration ([d298505](https://github.com/nicokempe/nuxt-feature-flags-module/commit/d298505))
- **config:** Rename `flags` to `flagSets` in feature flag configuration ([14ceeaa](https://github.com/nicokempe/nuxt-feature-flags-module/commit/14ceeaa))

### 📖 Documentation

- **dx:** Add update labels for dependabot pull requests ([98eea2e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/98eea2e))
- **readme:** Add total downloads (18m) ([ca78c46](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ca78c46))
- **nuxt:** Remove nuxt version specification ([9cab437](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9cab437))
- **conduct:** Add code of conduct ([3898f7f](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3898f7f))
- **contributing:** Add contribution guide ([732da43](https://github.com/nicokempe/nuxt-feature-flags-module/commit/732da43))
- **contributing:** Add note on how to bump the project version ([1a52568](https://github.com/nicokempe/nuxt-feature-flags-module/commit/1a52568))
- **features:** Update examples in README ([cef560f](https://github.com/nicokempe/nuxt-feature-flags-module/commit/cef560f))

### 🏡 Chore

- **pnpm:** Update packages ([c7c80d8](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c7c80d8))
- **pnpm:** Bump changelogen from 0.6.1 to 0.6.2 ([#49](https://github.com/nicokempe/nuxt-feature-flags-module/pull/49))
- **pnpm:** Bump @types/node from 24.0.10 to 24.0.13 ([#51](https://github.com/nicokempe/nuxt-feature-flags-module/pull/51))
- **pnpm:** Bump tmp from 0.2.3 to 0.2.4 in the npm_and_yarn group ([#73](https://github.com/nicokempe/nuxt-feature-flags-module/pull/73))
- **pnpm:** Update packages ([c539f2c](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c539f2c))
- **actions:** Bump actions/checkout from 4 to 5 ([#74](https://github.com/nicokempe/nuxt-feature-flags-module/pull/74))
- **pnpm:** Update packages ([a45e3de](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a45e3de))
- **pnpm:** Update packages ([29623ca](https://github.com/nicokempe/nuxt-feature-flags-module/commit/29623ca))
- **config:** Add missing compatibility dates ([b543651](https://github.com/nicokempe/nuxt-feature-flags-module/commit/b543651))

### ✅ Tests

- **flagValidator:** Add unit tests for feature flag validation ([4568e74](https://github.com/nicokempe/nuxt-feature-flags-module/commit/4568e74))
- **isFeatureEnabled:** Add unit tests for feature flag evaluation ([effb7f5](https://github.com/nicokempe/nuxt-feature-flags-module/commit/effb7f5))
- **isFlagActiveNow:** Add unit tests for flag activation logic ([ad8c6b3](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ad8c6b3))
- **useFeatureFlag:** Add unit tests for feature flag detection and scheduling ([ee72e7e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ee72e7e))

### 🤖 CI

- Add `workflow_dispatch` trigger ([9c636be](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9c636be))
- **security:** Restrict GITHUB_TOKEN permissions to contents:read ([183430a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/183430a))
- **dependabot:** Update commit message prefixes for pnpm and actions ([099fae1](https://github.com/nicokempe/nuxt-feature-flags-module/commit/099fae1))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))

## v2025.6.1

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/v2025.5.5...v2025.6.1)

### 🚀 Enhancements

- **dx:** Add lint:fix script ([9b5af63](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9b5af63))
- **deps:** Add globby for file pattern matching ([3b0ee62](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3b0ee62))
- **playground:** Add non-existing feature flag examples and validation configuration ([27b5ad1](https://github.com/nicokempe/nuxt-feature-flags-module/commit/27b5ad1))
- **validation:** Add configuration and `ready` hook ([0a85723](https://github.com/nicokempe/nuxt-feature-flags-module/commit/0a85723))
- **validation:** Add feature flag validation utility ([6094c0b](https://github.com/nicokempe/nuxt-feature-flags-module/commit/6094c0b))

### 🔥 Performance

- **validation:** Read source files in parallel for faster validation ([c5af66a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c5af66a))

### 💅 Refactors

- **v-feature:** Simplify feature flag directive using composable ([#13](https://github.com/nicokempe/nuxt-feature-flags-module/pull/13))
- **validation:** Remove redundant validation guards in module setup hook ([a4be7b6](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a4be7b6))

### 📖 Documentation

- **security:** Add security policy ([f77d52b](https://github.com/nicokempe/nuxt-feature-flags-module/commit/f77d52b))
- **readme:** Update planned features ([6d01dca](https://github.com/nicokempe/nuxt-feature-flags-module/commit/6d01dca))
- **readme:** Add feature flag validation feature ([a6dde1e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a6dde1e))
- **readme:** Fix formatting error ([5274363](https://github.com/nicokempe/nuxt-feature-flags-module/commit/5274363))

### 🌊 Types

- **server:** Improve typing for `isFeatureEnabled` utility ([318186e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/318186e))
- **config:** Add validation options to FeatureFlagsConfig ([8b85a96](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8b85a96))
- **runtime:** Enhance type annotations and add middleware imports ([c99e693](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c99e693))

### 🏡 Chore

- **security:** Remove CodeQL advanced config ([13db209](https://github.com/nicokempe/nuxt-feature-flags-module/commit/13db209))
- **playground:** Use warn as default validation for the playground ([57db299](https://github.com/nicokempe/nuxt-feature-flags-module/commit/57db299))

### 🤖 CI

- **security:** Add CodeQL workflow ([abcdb7e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/abcdb7e))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))
- Maximilian Wiegmann ([@tylix](https://github.com/tylix))

## v2025.5.5

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/v2025.5.4...v2025.5.5)

### 🚀 Enhancements

- **playground:** Use Cloudlare Pages Nitro preset for deployment ([f8a0035](https://github.com/nicokempe/nuxt-feature-flags-module/commit/f8a0035))
- **playground:** Add default layout with responsive header and footer ([b5317cc](https://github.com/nicokempe/nuxt-feature-flags-module/commit/b5317cc))
- **playground:** Polish index page with improved button interactions, spacing fixes, and animations ([26d91d9](https://github.com/nicokempe/nuxt-feature-flags-module/commit/26d91d9))
- **playground:** Add SEO metadata to protected feature page ([9d817f4](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9d817f4))
- **playground:** Update scheduled page title design and add SEO metadata ([4b9f89d](https://github.com/nicokempe/nuxt-feature-flags-module/commit/4b9f89d))
- **package:** Update release script changelog command ([a5dee20](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a5dee20))

### 🩹 Fixes

- **package:** Remove comma-typo from package.json ([8e4ae2a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8e4ae2a))

### 📖 Documentation

- **changelog:** Add full changelog for 2025.5.1-dev to 2025.5.4 ([c6d75ad](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c6d75ad))
- **changelog:** Add full changelog for 2025.5.1-dev to 2025.5.4 ([e8c4dc7](https://github.com/nicokempe/nuxt-feature-flags-module/commit/e8c4dc7))
- **readme:** Update planned features and fix scheduling typo ([b334aa8](https://github.com/nicokempe/nuxt-feature-flags-module/commit/b334aa8))

### 🏡 Chore

- **playground:** Remove unused import ([52a6b1e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/52a6b1e))
- **package:** Remove outdated changelog command ([77ec2d4](https://github.com/nicokempe/nuxt-feature-flags-module/commit/77ec2d4))

### ❤️ Contributors

- Nico Kempe <git@nicokempe.de>

## v2025.5.4

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/2025.5.2...v2025.5.4)

### 🚀 Enhancements

- **playground:** Enhance layout and styling for feature flag protection page message ([6adf62a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/6adf62a))

### 📖 Documentation

- **flags:** Enhance code documentation for feature flag utilities and middleware ([b65cd00](https://github.com/nicokempe/nuxt-feature-flags-module/commit/b65cd00))

### 🏡 Chore

- **plugin:** Remove console log from feature flags plugin ([f534a00](https://github.com/nicokempe/nuxt-feature-flags-module/commit/f534a00))
- **release:** V2025.6.0 ([0af6f0e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/0af6f0e))
- **release:** V2025.5.4 ([dd50714](https://github.com/nicokempe/nuxt-feature-flags-module/commit/dd50714))

### ❤️ Contributors

- Nico Kempe <git@nicokempe.de>

## 2025.5.2

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/2025.5.1-dev...2025.5.2)

### 🚀 Enhancements

- Create dependabot.yml ([db13f6d](https://github.com/nicokempe/nuxt-feature-flags-module/commit/db13f6d))

### 🏡 Chore

- Create funding (sponsors) file ([fd1743f](https://github.com/nicokempe/nuxt-feature-flags-module/commit/fd1743f))
- Create GitHub code owners file ([a1ae860](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a1ae860))
- **release:** 2025.5.1-dev ([fcf6503](https://github.com/nicokempe/nuxt-feature-flags-module/commit/fcf6503))
- **dx:** Add bug report issue template ([8bf428e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8bf428e))
- **dx:** Add feature request issue template ([d03c09d](https://github.com/nicokempe/nuxt-feature-flags-module/commit/d03c09d))
- **dx:** Add changelog script ([97090da](https://github.com/nicokempe/nuxt-feature-flags-module/commit/97090da))
- **dx:** Add config for contact links in issue creation ([46ccdae](https://github.com/nicokempe/nuxt-feature-flags-module/commit/46ccdae))
- **dx:** Add pull request template for contributors ([82d3233](https://github.com/nicokempe/nuxt-feature-flags-module/commit/82d3233))
- **readme:** Add Nuxt banner to README ([c4af35b](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c4af35b))
- **release:** Prepare 2025.5.2 ([409f289](https://github.com/nicokempe/nuxt-feature-flags-module/commit/409f289))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))

## 2025.5.1-dev

[compare changes](https://github.com/nicokempe/nuxt-feature-flags-module/compare/82f54dc...2025.5.1-dev)

### 🚀 Enhancements

- **dx:** Create .editorconfig ([6bb0db2](https://github.com/nicokempe/nuxt-feature-flags-module/commit/6bb0db2))
- **dx:** Create gitignore ([28893cc](https://github.com/nicokempe/nuxt-feature-flags-module/commit/28893cc))
- Create Nuxt module project ([125a423](https://github.com/nicokempe/nuxt-feature-flags-module/commit/125a423))
- **dx:** Create ESlint config ([cdb6654](https://github.com/nicokempe/nuxt-feature-flags-module/commit/cdb6654))
- **flags:** Create useFeatureFlag composable ([ca970ca](https://github.com/nicokempe/nuxt-feature-flags-module/commit/ca970ca))
- **flags:** Create v-feature directive ([c96a2bd](https://github.com/nicokempe/nuxt-feature-flags-module/commit/c96a2bd))
- **flags:** Create defineFeatureFlagMiddleware ([e090edb](https://github.com/nicokempe/nuxt-feature-flags-module/commit/e090edb))
- **flags:** Update plugin types and load feature directive ([766369e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/766369e))
- **server:** Add isFeatureEnabled export ([b8aa417](https://github.com/nicokempe/nuxt-feature-flags-module/commit/b8aa417))
- **app:** Update template to use NuxtPage and add Tailwind CSS script ([509f23e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/509f23e))
- **config:** Add feature flags configuration for different environments ([57eef2a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/57eef2a))
- **directives:** Add global directive type for feature flags in Vue ([66f0afc](https://github.com/nicokempe/nuxt-feature-flags-module/commit/66f0afc))
- **middleware:** Add route middleware for new system feature flag ([fbd541d](https://github.com/nicokempe/nuxt-feature-flags-module/commit/fbd541d))
- **playground:** Add Nuxt Feature Flags Playground component ([9d3e573](https://github.com/nicokempe/nuxt-feature-flags-module/commit/9d3e573))
- **protected:** Add protected page and middleware for feature flag validation ([a2c7b2e](https://github.com/nicokempe/nuxt-feature-flags-module/commit/a2c7b2e))

### 🩹 Fixes

- **imports:** Update import paths to static for feature flag files ([f707c2c](https://github.com/nicokempe/nuxt-feature-flags-module/commit/f707c2c))

### 📖 Documentation

- Update README.md ([16ec894](https://github.com/nicokempe/nuxt-feature-flags-module/commit/16ec894))
- Add documentation to the ReadMe ([8ac512b](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8ac512b))
- Update README with feature flag configuration and usage examples ([86ce9a5](https://github.com/nicokempe/nuxt-feature-flags-module/commit/86ce9a5))

### 🌊 Types

- Improve module types ([df5d34b](https://github.com/nicokempe/nuxt-feature-flags-module/commit/df5d34b))
- **flags:** Add feature flags types ([1f21a50](https://github.com/nicokempe/nuxt-feature-flags-module/commit/1f21a50))
- **module:** Cast feature flags options to FeatureFlagsOptions type ([7b52634](https://github.com/nicokempe/nuxt-feature-flags-module/commit/7b52634))

### 🏡 Chore

- Rename project ([3468ef3](https://github.com/nicokempe/nuxt-feature-flags-module/commit/3468ef3))
- Remove deprecated myModule definition ([8d7b56c](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8d7b56c))
- Update package information ([4bc893a](https://github.com/nicokempe/nuxt-feature-flags-module/commit/4bc893a))

### 🤖 CI

- **test:** Add CI workflow ([8dda7ed](https://github.com/nicokempe/nuxt-feature-flags-module/commit/8dda7ed))

### ❤️ Contributors

- Nico Kempe ([@nicokempe](https://github.com/nicokempe))

