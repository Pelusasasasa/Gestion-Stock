const { z } = require('zod');

const chequeSchema = z.object({
    f_recibido: z.string({
        // invalid_type_error: 'La fecha debe ser una fecha',
        required_error: 'La fecha es obligatoria'
    }),
    numero: z.string({
        invalid_type_error: 'El numero es obligatorio',
        required_error: 'El numero es obligatorio'
    }),
    banco: z.string({
        invalid_type_error: 'El banco es obligatorio',
        required_error: 'El banco es obligatorio'
    }),
    f_cheque: z.string({
        // invalid_type_error: 'La fecha del cheque es obligatoria',
        required_error: 'La fecha del cheque es obligatoria'
    }),
    importe: z.number({
        invalid_type_error: 'El importe debe ser un numero',
    }),
    ent_por: z.string().optional().default(''),
    ent_a: z.string().optional().default(''),
    domicilio: z.string().optional().default(''),
    telefono: z.string().optional().default(''),
    tipo: z.string().optional().default(''),
    fechaPago: z.string().optional().default(''),
    vendedor: z.string().optional().default(''),
    pc: z.string().optional().default('')
});

async function validateCheque(input) {
    return await chequeSchema.safeParseAsync(input);
};


function validatePartialCheque(input) {
    return chequeSchema.partial().safeParse(input)
};

module.exports = {
    validateCheque,
    validatePartialCheque
}