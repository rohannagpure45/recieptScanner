import { allocateRemainder } from '@shared/money';
export function computeSplit(params) {
    const { receipt, guestIds, assignments, payerId, taxMode, tipMode } = params;
    const tipPercent = params.tipPercent ?? 0;
    const globalSubtotal = receipt.lineItems.reduce((s, li) => s + li.totalCents, 0);
    const taxTotal = receipt.taxCents;
    const tipTotal = tipMode === 'percent' ? Math.round((globalSubtotal * tipPercent) / 100) : receipt.tipCents;
    const personIdx = new Map();
    guestIds.forEach((id, i) => personIdx.set(id, i));
    const itemsTotal = new Array(guestIds.length).fill(0);
    const itemsByPerson = guestIds.map(() => []);
    for (const li of receipt.lineItems) {
        const assignees = assignments[li.id] ?? [];
        if (assignees.length === 0)
            continue; // unassigned; ignored in MVP
        const base = Math.floor(li.totalCents / assignees.length);
        let buckets = assignees.map(() => base);
        buckets = allocateRemainder(buckets, li.totalCents);
        assignees.forEach((gid, idx) => {
            const i = personIdx.get(gid);
            if (i === undefined)
                return;
            itemsTotal[i] += buckets[idx];
            itemsByPerson[i].push({ lineItemId: li.id, shareCents: buckets[idx] });
        });
    }
    const subtotalUsed = itemsTotal.reduce((a, b) => a + b, 0) || 1; // avoid div-by-zero
    // Tax allocation
    let taxBuckets;
    if (taxMode === 'even') {
        const base = Math.floor(taxTotal / guestIds.length);
        taxBuckets = allocateRemainder(new Array(guestIds.length).fill(base), taxTotal);
    }
    else {
        const base = itemsTotal.map((t) => Math.floor((t * taxTotal) / subtotalUsed));
        taxBuckets = allocateRemainder(base, taxTotal);
    }
    // Tip allocation
    let tipBuckets;
    if (tipMode === 'percent') {
        const each = itemsTotal.map((t) => Math.floor((t * tipPercent) / 100));
        tipBuckets = allocateRemainder(each, tipTotal);
    }
    else {
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
    };
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
