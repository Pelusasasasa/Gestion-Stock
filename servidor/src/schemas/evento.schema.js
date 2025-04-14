const { z } = require('zod');

const eventoSchema = z.object({
    title: z.string({
        required_error: 'El titulo debe ser obligatorio',
        invalid_type_error: 'El titulo tiene que ser un string'
    }),
    description: z.string().optional(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    all_day: z.boolean().default(false),
    category: z.string({
        required_error: 'La categoria es obligaoria',
        invalid_type_error: 'La categoria debe ser un string'
    })
});

async function validateEvento(input) {
    return await eventoSchema.safeParseAsync(input);
};

function validatePartialEvento(input) {
    return eventoSchema.partial().safeParse(input);
};

module.exports = {
    validateEvento,
    validatePartialEvento
}