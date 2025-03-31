const {z} = require('zod');

const chequeSchema = z.object({
    f_recibido: z.date({
        invalid_type_error: 'La fecha debe ser una fecha',
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
    f_cheque: z.date({
        invalid_type_error: 'La fecha del cheque es obligatoria',
        required_error: 'La fecha del cheque es obligatoria'
    }),
    importe: z.number({
        invalid_type_error: 'El importe debe ser un numero',
    }),
});

async function validateCheque(input) {
    return await chequeSchema.safeParseAsync(input);
};


function validatePartialCheque(input){
  return movieSchema.partial().safeParse(input)
};

module.exports = {
    validateCheque,
    validatePartialCheque
}