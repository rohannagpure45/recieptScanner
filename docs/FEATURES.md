# Receipt Scanner MVP – Features and Quirks

This document describes the current MVP implementation, how each feature works, and known quirks or edge cases to be aware of during QA and development.

## Flow Overview
- 3-step wizard in the frontend:
  - Upload → Match → Review
- Backend Express API handles uploads and parsing via an OCR + LLM pipeline (mocked by default).
- Shared Zod schemas enforce strict JSON data shapes and cents math.

## Upload (Step 1)
- Components: `ReceiptUploader`, `GuestsList`, page: `frontend/src/pages/UploadPage.tsx`
- UX rules:
  - “Next” is disabled until a valid file is selected AND at least one guest has a non-empty name.
  - Accepted MIME types (client-side): `image/png`, `image/jpeg`, `application/pdf`.
  - Max upload size (server-side, in-memory): 8 MB (multer limit).

### Network Timeout
- The POST to `/api/receipts` uses an `AbortController` with a 10s timeout.
- Implementation details:
  - A timer calls `controller.abort()` after 10,000 ms.
  - `controller.signal` is passed to `fetch`.
  - The timer is cleared on both success and failure to prevent leaks.
  - On `AbortError`, UI shows: “Upload timed out. Please try again.” and stops the “Uploading…” state.

### Response Validation
- The client verifies the response shape before updating state:
  - Confirms `typeof data === 'object' && data !== null`.
  - Confirms `data.receipt` is not null/undefined.
  - On invalid shape: sets `parsedData` to `undefined` and surfaces a clear error.
- This prevents downstream crashes in the Match/Review steps.

### Typical Errors
- 400 Missing file: server returns `{ error: 'Missing receipt upload.' }`.
- Timeout: `AbortError` handled with a friendly message and no dangling timers.
- 5xx/Invalid response: message from server body or a generic “Upload failed”.

## Parsing Pipeline (Backend)
- Entry: `POST /api/receipts` (multer memory storage)
- Steps:
  1) Preprocess image (placeholder – rotation/contrast planned)
  2) OCR: Google Vision primary (gated by `GOOGLE_CREDENTIALS_JSON`), Tesseract fallback
  3) LLM parse: Claude client
     - If `CLAUDE_API_KEY` is absent, returns a valid mock `ParsedReceipt` for local dev.
  4) Validation: checks `subtotal + tax + tip ≈ total` within 50 cents; throws otherwise.
- Known quirks:
  - Preprocess and OCR are stubs; Vision/Tesseract not integrated yet.
  - LLM is mocked in dev; production requires real Claude calls with deterministic settings.
  - Validation failures surface as 500s today; UI shows the error text.

## Match (Step 2)
- Components: `ParsedItemsTable`, `AssignmentsList` → `AssignItem`, `PayerSelector`.
- Assignments:
  - Each line item can be assigned to one or more guests via checkboxes.
  - Equal split across selected guests; cents are allocated fairly via remainder distribution.
  - Unassigned items are currently ignored in computation (must assign all to proceed).
- Controls:
  - Tax mode: `proportional` (default) or `even`.
  - Tip mode: `fixed` (from receipt, default) or `percent` (requires a numeric percent).
  - Continue is enabled only when all items are assigned and a payer is selected.

### Compute Engine
- File: `frontend/src/lib/compute.ts`
- Inputs: `receipt`, `guestIds`, `assignments`, `payerId`, `taxMode`, `tipMode`, `tipPercent?`.
- Algorithm (all values are integers in cents):
  - Items: each item’s `totalCents` is split equally across selected guests (remainder distributed 1¢ at a time).
  - Global subtotal: sum of all item totals in the receipt (`globalSubtotal`).
  - Tax:
    - `proportional`: `tax_p = tax * (items_total_p / subtotalUsed)`, `subtotalUsed = sum(items_total_p)`.
    - `even`: split equally across all guests.
  - Tip:
    - `fixed`: `tip_p = tip * (items_total_p / subtotalUsed)`.
    - `percent`: total tip = `round(globalSubtotal * tipPercent / 100)`, then `tip_p` proportional to `items_total_p`.
  - Totals: `total_p = items_total_p + tax_p + tip_p`.
  - Payer: `owedToPayerCents` is 0 for the payer, and `total_p` for others (assumes no prepayments).
  - Rounding: `allocateRemainder` ensures buckets sum exactly to targets.
- Quirks/Limits:
  - Only equal splits per item for now (no per-item percentages/basis points yet).
  - Unassigned items are excluded from `subtotalUsed`, which affects proportional tax/tip distribution; assign all items for accuracy.

## Review (Step 3)
- Components: `SummaryCard` per person, `DebtsTable`, `ExportButtons`.
- Data source: `computation` produced on Match `Continue`.
- Quirks:
  - Changing tax/tip settings requires recomputing on the Match screen (current UX).
  - Export buttons are placeholders; email sending is not wired.

## Backend API
- `GET /` → plain text “Receipt Scanner API is running”
- `GET /health` → `{ ok: true }`
- `POST /api/receipts` (multipart/form-data):
  - Fields: `receipt` (file), `guests` (JSON string), optional `payerId`, `tipMode`, `tipPercent`.
  - Success: `{ receipt: ParsedReceipt }`
  - Example success (shape only):
    ```json
    {
      "receipt": {
        "receiptId": "uuid",
        "merchant": "Sample Cafe",
        "transactionDate": "2024-10-26",
        "currency": "USD",
        "lineItems": [
          { "id": "uuid", "name": "Latte", "quantity": 1, "unitPriceCents": 1299, "totalCents": 1299 }
        ],
        "subtotalCents": 1299,
        "taxCents": 117,
        "tipCents": 0,
        "totalCents": 1416
      }
    }
    ```

## Shared Schemas
- Package: `packages/shared/src/schemas.ts`
- Guarantees:
  - UUID v4 IDs for `receiptId`, `lineItems.id`, and guest IDs.
  - All money fields are integers in cents.
  - Validation includes a reconciliation check (±50¢ tolerance) in `backend/src/utils/validation.ts`.

## Environment Variables
- `CLAUDE_API_KEY`: when absent, backend returns a safe mock receipt.
- `GOOGLE_CREDENTIALS_JSON`: enables Vision OCR; when absent, Vision returns empty and Tesseract fallback is used.
- `SENDGRID_API_KEY`: planned; enables email sending in a later iteration.

## Known Limitations
- OCR and Claude integrations are placeholders; real services require keys and full implementations.
- No persistence: uploads are not stored (S3/R2 planned) and no DB records.
- AssignItem supports equal split only; percentage/amount splits are planned.
- Review page toggles do not dynamically recompute yet.
- Server-side MIME validation is minimal; client enforces common types.

## Dev Notes
- Frontend dev: `npm run dev --workspace frontend` (Vite on `:5173`, proxies `/api` → `:4000`).
- Backend dev: `npm run dev --workspace backend` (Express on `:4000`, CommonJS via `ts-node-dev`).
- Builds: `npm run build --workspaces`.
- Logs: `frontend-dev.log`, `backend-dev.log`. Stop with `pkill -f vite` / `pkill -f ts-node-dev`.

