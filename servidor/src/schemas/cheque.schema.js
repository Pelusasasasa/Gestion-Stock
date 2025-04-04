const {z} = require('zod');

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
    ent_por: z.string(),
    // ent_a: z.string(),
    // domicilio: z.string(),
    // telefono: z.string(),
    // tipo: z.string(),
    // fechaPago: z.string(),
    // vendedor: z.string(),
    // pc: z.string()
});

async function validateCheque(input) {
    console.log(input)
    return await chequeSchema.safeParseAsync(input);
};


function validatePartialCheque(input){
  return movieSchema.partial().safeParse(input)
};

module.exports = {
    validateCheque,
    validatePartialCheque
}