# Receipt Scanner

AI‑assisted receipt splitter: upload a receipt, assign items to guests, and compute fair shares with precise cents math.

## Features

- 3‑step wizard (Upload → Match → Review)
  - Upload image/PDF with client validation + 10s network timeout (AbortController)
  - Vision‑first parsing: send the receipt image to Claude (LLM) and return strict JSON validated by Zod (no OCR fallback currently wired)
  - Assign items to one/more guests with equal split (deterministic cent distribution)
  - Compute per‑person totals with proportional/even tax and fixed/percent tip
- CSV/JSON export of computed results
- Email sending endpoint stub (SendGrid ready; dry‑run without key)
- Health/root endpoints for quick checks
- Strict Zod schemas shared across frontend/backend, cents-safe helpers

See docs/FEATURES.md for a detailed walkthrough and quirks.

## Monorepo Layout

- `frontend/` – Vite + React + Tailwind
- `backend/` – Express API (CommonJS for dev via ts-node-dev)
- `packages/shared/` – shared TypeScript schemas, money helpers, prompts
- `docs/` – specs, details, feature docs

## Development

Prereqs: Node 18+, npm.

Install deps

```
npm install
```

Run dev (frontend + backend in parallel)

```
npm run dev
# or: npm run dev:frontend  |  npm run dev:backend
```

Ports

- Frontend: Vite on 5173 (auto‑bumps if busy)
- Backend: Express on 4000 (root `/`, health `/health`, API `/api/receipts`)

## Environment Variables

Create a `.env` in repo root (or backend/) – a lightweight loader reads it on backend boot.

- `CLAUDE_API_KEY` – enables Anthropic Claude parsing (messages API, vision‑first)
- `CLAUDE_MODEL` – optional (default `claude-3-haiku-20240307`)
- `GOOGLE_CREDENTIALS_JSON` – optional; not required in vision‑first mode
- `SENDGRID_API_KEY` – optional; real email sending (otherwise dry‑run logged)

## API Endpoints

- `GET /` → text: API running
- `GET /health` → `{ ok: true }`
- `POST /api/receipts` (multipart/form-data)
  - fields: `receipt` (file), `guests` (JSON string), optional `payerId`, `tipMode`, `tipPercent`
  - returns: `{ receipt: ParsedReceipt }`
- `POST /api/receipts/email`
  - body: `{ computation, guests }`
  - queues email (dry‑run without SENDGRID_API_KEY)

## Build & Test

```
npm run build --workspaces
npm run test --workspaces
npm run lint --workspaces
npm run format --workspaces
```

## Notes

- In dev without CLAUDE_API_KEY, backend returns a mock receipt.
- Vision‑first pipeline: no OCR fallback is wired at the moment.
- All money math uses integers in cents; see `packages/shared/src/money.*`.

## License

MIT
