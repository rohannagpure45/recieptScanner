export function toCents(amount) {
    const value = typeof amount === 'string' ? Number(amount) : amount;
    return Math.round(value * 100);
}
export function fromCents(cents) {
    return (cents / 100).toFixed(2);
}
export function allocateRemainder(buckets, targetTotal) {
    const currentTotal = buckets.reduce((sum, value) => sum + value, 0);
    const diff = targetTotal - currentTotal;
    if (diff === 0 || buckets.length === 0)
        return buckets;
    const sorted = buckets.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
    for (let i = 0; i < Math.abs(diff); i += 1) {
        const idx = sorted[i % sorted.length].index;
        buckets[idx] += diff > 0 ? 1 : -1;
    }
    return buckets;
}
