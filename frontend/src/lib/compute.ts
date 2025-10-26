import type { ComputationOutput, ParsedReceipt } from '@shared/schemas';
import { allocateRemainder } from '@shared/money';

export type TaxMode = 'proportional' | 'even';
export type TipMode = 'fixed' | 'percent';

export function computeSplit(params: {
  receipt: ParsedReceipt;
  guestIds: string[];
  assignments: Record<string, string[]>; // lineItemId -> guestIds
  payerId: string;
  taxMode: TaxMode;
  tipMode: TipMode;
  tipPercent?: number;
}): ComputationOutput {
  const { receipt, guestIds, assignments, payerId, taxMode, tipMode } = params;
  const tipPercent = params.tipPercent ?? 0;

  const globalSubtotal = receipt.lineItems.reduce(
    (s: number, li: ParsedReceipt['lineItems'][number]) => s + li.totalCents,
    0
  );
  const taxTotal = receipt.taxCents;
  const tipTotal = tipMode === 'percent' ? Math.round((globalSubtotal * tipPercent) / 100) : receipt.tipCents;

  const personIdx = new Map<string, number>();
  guestIds.forEach((id, i) => personIdx.set(id, i));

  const itemsTotal = new Array(guestIds.length).fill(0);
  const itemsByPerson: Array<{ lineItemId: string; shareCents: number }[]> = guestIds.map(() => []);

  for (const li of receipt.lineItems) {
    const assignees = assignments[li.id] ?? [];
    if (assignees.length === 0) continue; // unassigned; ignored in MVP

    const validIds = assignees.filter((gid) => personIdx.has(gid));
    const missingIds = assignees.filter((gid) => !personIdx.has(gid));

    if (missingIds.length > 0) {
      // Defensive: warn and proceed with valid assignees only.
      // This should not occur via UI, but protects against inconsistent state.
      console.warn(
        `computeSplit: skipping unknown assignees for lineItem ${li.id}: ${missingIds.join(', ')}`
      );
    }

    if (validIds.length === 0) {
      // Nothing valid to assign; treat as unassigned
      continue;
    }

    const base = Math.floor(li.totalCents / validIds.length);
    let buckets = validIds.map(() => base);
    buckets = allocateRemainder(buckets, li.totalCents);

    validIds.forEach((gid, idx) => {
      const i = personIdx.get(gid);
      if (i === undefined) {
        throw new Error(
          `computeSplit invariant: missing guest index for gid='${gid}' on lineItem '${li.id}'`
        );
      }
      itemsTotal[i] += buckets[idx];
      itemsByPerson[i].push({ lineItemId: li.id, shareCents: buckets[idx] });
    });
  }

  // Sum of assigned item totals across all guests. If this is zero, it means
  // no items were assigned to anyone. We treat this as a hard error instead of
  // silently dividing by 1 (which would mask real issues) because proportional
  // tax/tip splits are undefined without any assigned items.
  const subtotalUsed = itemsTotal.reduce((a, b) => a + b, 0);
  if (subtotalUsed === 0) {
    throw new Error('All items unassigned: assign at least one item before computing splits.');
  }

  // Tax allocation
  let taxBuckets: number[];
  if (taxMode === 'even') {
    const base = Math.floor(taxTotal / guestIds.length);
    taxBuckets = allocateRemainder(new Array(guestIds.length).fill(base), taxTotal);
  } else {
    const base = itemsTotal.map((t) => Math.floor((t * taxTotal) / subtotalUsed));
    taxBuckets = allocateRemainder(base, taxTotal);
  }

  // Tip allocation
  let tipBuckets: number[];
  if (tipMode === 'percent') {
    const each = itemsTotal.map((t) => Math.floor((t * tipPercent) / 100));
    tipBuckets = allocateRemainder(each, tipTotal);
  } else {
    const base = itemsTotal.map((t) => Math.floor((t * tipTotal) / subtotalUsed));
    tipBuckets = allocateRemainder(base, tipTotal);
  }

  const perPerson = guestIds.map((gid, i) => {
    const itemsTotalCents = itemsTotal[i];
    const taxCents = taxBuckets[i];
    const tipCents = tipBuckets[i];
    const totalCents = itemsTotalCents + taxCents + tipCents;
    const amountPaidCents = 0;
    const owedToPayerCents = gid === payerId ? 0 : totalCents - amountPaidCents;
    return { guestId: gid, items: itemsByPerson[i], itemsTotalCents, taxCents, tipCents, totalCents, amountPaidCents, owedToPayerCents };
  });

  const totals = {
    subtotalCents: globalSubtotal,
    taxCents: taxTotal,
    tipCents: tipTotal,
    grandTotalCents: receipt.totalCents
  } as const;

  return {
    receiptId: receipt.receiptId,
    payerId,
    tipMode: tipMode,
    tipPercent: tipMode === 'percent' ? tipPercent : undefined,
    perPerson,
    totals,
    rounding: { residualCents: 0, distribution: [] }
  };
}
