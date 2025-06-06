# Changelog


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

