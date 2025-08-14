const { z } = require('zod');

const provedorSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }),

    iva: z.string({
        invalid_type_error: 'El iva debe ser un string',
        required_error: 'El iva es requerido'
    }),

    cuit: z.string({
        invalid_type_error: 'El cuit debe ser un string',
        required_error: 'El cuit es requerido'
    }),

    domicilio: z.string({
        invalid_type_error: 'El domicilio debe ser un string',
        required_error: 'El domicilio es requerido'
    }),

    localidad: z.string({
        invalid_type_error: 'La localidad debe ser un string',
        required_error: 'La localidad es requerido'
    }),

    codPostal: z.string().optional().default(''),
    provincia: z.string().optional().default(''),
    telefono: z.string().optional().default(''),
    mail: z.string().optional().default(''),
    saldo: z.number().optional().default(0)


});


async function validateProvedor(input) {
    return await provedorSchema.safeParseAsync(input)
};

async function validatePartialProvedor(input) {
    return await provedorSchema.partial().safeParseAsync(input);
}

module.exports = {
    validateProvedor,
    validatePartialProvedor
};