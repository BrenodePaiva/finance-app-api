import z from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.uuid({ error: 'User ID must be a valid UUID.' }),
    name: z
        .string({ error: 'Name is required.' })
        .min(1, { error: 'Name is required.' }),
    date: z.iso.datetime({ error: 'Date must be a valid iso date.' }),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        error: 'The type must be EARNING, EXPENSE or INVESTMENT.'
    }),
    amount: z
        .number({ error: 'Amount must be a number.' })
        .min(1, { error: 'Amount must be greater than 0.' })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.'
            })
        )
})

export const updateTransactionSchema = createTransactionSchema
    .omit({ user_id: true })
    .partial()

export const getTransactionByUserIdSchema = z.object({
    user_id: z.uuid({ error: 'User ID must be a valid UUID.' }),
    from: z.iso.date({ error: 'Date must be a valid date.' }),
    to: z.iso.date({ error: 'Date must be a valid date.' })
})
