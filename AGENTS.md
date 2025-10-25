# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` contains the Vite React wizard (`src/pages/{upload,match,review}` plus shared `components/` and `context/`).
- `backend/` hosts the Express server with `routes/receipts.ts`, `services/ocr/`, `services/llm/`, and `workers/` for async parsing.
- `packages/shared/` stores TypeScript schemas, cents math helpers, and types used by both sides; import from here instead of redefining.
- `infra/` holds IaC (Terraform/CDK) plus deployment scripts, while `docs/` houses specs, diagrams, and this guide.
- Tests for each workspace live alongside source files (`*.test.ts`) and may use `tests/fixtures/receipts/` for OCR samples.

## Build, Test, and Development Commands
- `npm install` (repo root) bootstraps all workspaces via npm workspaces.
- `npm run dev --workspace frontend` launches Vite with Tailwind watch mode.
- `npm run dev --workspace backend` starts the API with hot reload (ts-node-dev or nodemon).
- `npm run build --workspaces` produces production bundles for every package.
- `npm run test --workspaces` executes Vitest (frontend/shared) and Jest (backend); add `--runInBand` if debugging the pipeline.

## Coding Style & Naming Conventions
- TypeScript everywhere; keep strict mode on and prefer explicit return types for exported functions.
- Use 2-space indentation, single quotes in TS/JS, and PascalCase for React components; backend service classes use `VerbService`.
- Run `npm run lint --workspaces` before pushing; formatting is enforced by Prettier (`npm run format`).
- Amounts must be represented as integers in cents; helpers live in `packages/shared/money.ts`.

## Testing Guidelines
- Vitest powers component/hooks tests; Jest covers services and routers. Test filenames mirror the module (`receiptService.test.ts`).
- Mock external APIs (Vision, Tesseract, Claude, SendGrid) via `__mocks__/` to keep tests hermetic.
- Maintain >85% branch coverage for shared math + allocation utilities; record gaps in `docs/testing.md`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`); scope with workspace when relevant (`feat(frontend): add AssignItem`).
- PRs must describe the user-facing change, include test evidence, link to an issue, and attach screenshots/GIFs for UI tweaks.
- Ensure CI (lint + test) passes before requesting review; draft PRs are welcome for early feedback.

## Security & Configuration Tips
- Never commit API keys; use `.env.example` as the contract and load secrets via Doppler or AWS SSM.
- Restrict receipt uploads to image/PDF MIME types and scan outputs before persisting to S3-compatible storage.
