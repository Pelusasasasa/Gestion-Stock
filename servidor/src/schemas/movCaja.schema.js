const { z } = require("zod");


const movCajaSchema = z.object({
    fecha: z.coerce.date(),
    descripcion: z.string().optional(),
    tipo: z.string({
        required_error: 'El tipo de cuenta es  obligatorio',
        invalid_type_error: 'El tipo debe ser un objectId'

    }),
    importe: z.coerce.number({
        required_error: 'El importe es obligatorio',
        invalid_type_error: 'El importe debe ser un numero'
    }),
    vendedor: z.string({
        required_error: 'El vendedor es obligatorio',
        invalid_type_error: 'El vendedor debe ser un ObjectId'
    })
});


async function validateMovCajaSchema(input) {
    return await movCajaSchema.safeParse(input);
};
async function validatePartialMovCajaSchema(input) {
    return await movCajaSchema.partial().safeParse(input);
};

module.exports = {
    validateMovCajaSchema,
    validatePartialMovCajaSchema
}