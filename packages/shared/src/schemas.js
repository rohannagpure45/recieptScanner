import { z } from 'zod';
export const LineItemSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    quantity: z.number().int().min(1),
    unitPriceCents: z.number().int().min(0),
    totalCents: z.number().int().min(0),
    category: z.string().optional(),
    notes: z.string().optional()
});
export const ParsedReceiptSchema = z.object({
    receiptId: z.string().uuid(),
    merchant: z.string().min(1),
    transactionDate: z.string(),
    currency: z.string().length(3).default('USD'),
    category: z.string().optional(),
    notes: z.string().optional(),
    lineItems: z.array(LineItemSchema).min(1),
    subtotalCents: z.number().int().min(0),
    taxCents: z.number().int().min(0),
    tipCents: z.number().int().min(0),
    totalCents: z.number().int().min(0),
    error: z.string().optional()
});
export const GuestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email().optional(),
    venmoHandle: z.string().optional(),
    paypalLink: z.string().url().optional()
});
export const AssignmentSplitSchema = z
    .object({
    guestId: z.string().uuid(),
    shareBasisPoints: z.number().int().min(0).max(10000).optional(),
    amountCents: z.number().int().min(0).optional()
})
    .refine((val) => val.shareBasisPoints !== undefined || val.amountCents !== undefined, {
    message: 'Provide either shareBasisPoints or amountCents.'
});
export const ItemAssignmentSchema = z.object({
    lineItemId: z.string().uuid(),
    splits: z.array(AssignmentSplitSchema).min(1)
});
export const AssignmentsMappingSchema = z.object({
    receiptId: z.string().uuid(),
    assignments: z.array(ItemAssignmentSchema)
});
export const PersonComputationSchema = z.object({
    guestId: z.string().uuid(),
    items: z.array(z.object({
        lineItemId: z.string().uuid(),
        shareCents: z.number().int().min(0)
    })),
    itemsTotalCents: z.number().int().min(0),
    taxCents: z.number().int().min(0),
    tipCents: z.number().int().min(0),
    totalCents: z.number().int(),
    amountPaidCents: z.number().int().min(0).default(0),
    owedToPayerCents: z.number().int()
});
export const ComputationOutputSchema = z.object({
    receiptId: z.string().uuid(),
    payerId: z.string().uuid(),
    tipMode: z.enum(['fixed', 'percent']),
    tipPercent: z.number().min(0).optional(),
    perPerson: z.array(PersonComputationSchema),
    totals: z.object({
        subtotalCents: z.number().int().min(0),
        taxCents: z.number().int().min(0),
        tipCents: z.number().int().min(0),
        grandTotalCents: z.number().int().min(0)
    }),
    rounding: z.object({
        residualCents: z.number().int(),
        distribution: z.array(z.object({
            guestId: z.string().uuid(),
            deltaCents: z.number().int()
        }))
    })
});
export const GuestsArraySchema = z.array(GuestSchema).min(1);
