export function toCents(amount) {
    let value;
    if (typeof amount === 'string') {
        value = Number(amount.trim());
    }
    else {
        value = Number(amount);
    }
    if (!Number.isFinite(value)) {
        throw new TypeError(`toCents expects a finite numeric amount, got ${String(amount)}`);
    }
    return Math.round(value * 100);
}
export function fromCents(cents) {
    const isNumber = typeof cents === 'number' && Number.isFinite(cents);
    const isNumericString = typeof cents === 'string' && /^[+-]?(?:\d*\.\d+|\d+\.?\d*)$/.test(cents.trim());
    if (!(isNumber || isNumericString)) {
        throw new TypeError(`fromCents expects a numeric cents value (number or numeric string), got ${String(cents)}`);
    }
    const value = Number(typeof cents === 'string' ? cents.trim() : cents);
    return (value / 100).toFixed(2);
}
export function allocateRemainder(buckets, targetTotal) {
    if (!Array.isArray(buckets)) {
        throw new TypeError('allocateRemainder expects buckets to be an array');
    }
    if (!Number.isFinite(Number(targetTotal))) {
        throw new TypeError(`allocateRemainder expects a finite targetTotal, got ${String(targetTotal)}`);
    }
    const copy = buckets.map((v) => {
        const n = Math.round(Number(v));
        if (!Number.isFinite(n))
            throw new TypeError('allocateRemainder buckets must contain only numbers');
        return Math.max(0, n);
    });
    const currentTotal = copy.reduce((sum, value) => sum + value, 0);
    let diff = Math.round(Number(targetTotal)) - currentTotal;
    const n = copy.length;
    if (diff === 0 || n === 0)
        return copy.slice();
    const sorted = copy
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map((x) => x.index);
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            const idx = sorted[i % n];
            copy[idx] += 1;
        }
        return copy;
    }
    // diff < 0: subtract while clamping at 0 and skipping empty buckets
    let remaining = Math.min(-diff, currentTotal); // cannot subtract more than available
    let pos = 0;
    while (remaining > 0) {
        // Find next index with available cents
        let attempts = 0;
        let idx = sorted[pos % n];
        while (copy[idx] === 0 && attempts < n) {
            pos++;
            idx = sorted[pos % n];
            attempts++;
        }
        if (attempts >= n && copy[idx] === 0) {
            // All buckets are zero; nothing more to subtract
            break;
        }
        copy[idx] -= 1; // safe: ensured > 0
        remaining--;
        pos++;
    }
    return copy;
}
