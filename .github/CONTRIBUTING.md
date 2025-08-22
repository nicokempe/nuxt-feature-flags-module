# Contributing

Thank you for considering contributing to **nuxt-feature-flags-module**.

## Getting Started

- Use **pnpm** for all package management.
- Install dependencies with `pnpm install`.
- After installing, run `pnpm run lint:fix` to auto-fix lint issues.

## Commands

| Command      | Description                                               |
|--------------|-----------------------------------------------------------|
| `pnpm lint`  | Lint the project                                          |
| `pnpm test`  | Run unit tests in `tests/unit` (optional for AI workflow) |
| `pnpm build` | Production build                                          |
| `pnpm dev`   | Start development server                                  |

## Branch Policy

- Target branch: `main`
- Branch names: short, kebab-case prefixed by type
  - `feat/short-topic`
  - `fix/issue-123`

## Commit Policy

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): summary in present tense
```

Types: `chore` | `docs` | `feat` | `fix` | `refactor` | `style` | `test` | `ci`

Add a short bullet list in the body if the subject needs more detail:

```
feat(auth): add email otp reauthentication flow

- introduce verify-otp endpoint in nitro
- handle otp expiration and resend limits
- add ui notifications for success and failure
```

## Coding Conventions

- Strict TypeScript (`noImplicitAny`, `strict` enabled)
- Avoid using `any`
- Centralize validation logic in `~/utils/validators.ts`
- Follow DRY, KISS, and Single Responsibility principles
- Prefer `refactor` over `chore` for non-behavioral code changes
- Use `style` only for non-functional changes

## Pull Requests

- Pull requests **must** use the template at `.github/pull_request_template.md`.
- Run linting and tests before opening a PR.
- Keep changes small and focused.

## Releases

- Ensure you are on the `main` branch with a clean working tree and are authenticated with npm.
- Run `pnpm run release` to lint, test, build the module, update the changelog with `changelogen`, publish to npm, and push git tags.
- Verify the release on npm and that tags were pushed upstream.

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Commit Messages](https://seesparkbox.com/foundry/semantic_commit_messages)
- [Karma Git Commit Msg](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)
