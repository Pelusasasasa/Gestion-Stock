const { z } = require('zod');

const tarjetaSchema = z.object({
    fecha: z.string({
        // invalid_type_error: 'La fecha debe ser una fecha',
        required_error: 'La fecha es requerida'
    }),
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es obligatorio'
    }),
    importe: z.number({
        invalid_type_error: 'El importe debe ser un number',
        required_error: 'El importe es obligatorio'
    }),
    vendedor: z.string({
        invalid_type_error: 'El vendedor debe ser un String',
        required_error: 'El vendedor es obligatorio'
    }),
    tarjeta: z.string({
        invalid_type_error: 'El tarjeta debe ser un String',
        required_error: 'El tarjeta es obligatorio'
    }),
    tipo: z.string(),
});


async function validateTarjeta(input) {
    return await tarjetaSchema.safeParseAsync(input);
};

function validatePartialTarjeta(input) {
    return tarjetaSchema.partial().safeParse(input)
};

module.exports = {
    validateTarjeta,
    validatePartialTarjeta
}