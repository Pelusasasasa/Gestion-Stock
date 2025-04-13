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
}).refine(data => data.end_date > data.start_date, {
    message: 'La fecha del fin debe ser posterior  a la de inicio',
    path: ['end_date']
}).transform(data => {
    if (data.all_day) {
        const toStartOfDay = (date) => {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        };

        return {
            ...data,
            start_date: toStartOfDay(data.start_date),
            end_date: toStartOfDay(data.end_date)
        };
    }

    return data;


});

async function validateEvento(input) {
    return await eventoSchema.safeParseAsync(input);
};
async function validatePartialEvento(input) {
    return await eventoSchema.partial().safeParseAsync(input);
};

module.exports = {
    validateEvento,
    validatePartialEvento
}