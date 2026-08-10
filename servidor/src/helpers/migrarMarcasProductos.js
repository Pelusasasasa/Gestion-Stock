const Producto = require('../models/producto');
const Marca = require('../models/Marca');
const mongoose = require('mongoose');

const migrarMarcasProductos = async () => {
  try {
    console.log('🔄 Iniciando verificación/migración de marcas en productos...');

    // Obtener todos los productos que tengan el campo marca definido
    const productos = await Producto.find({ marca: { $ne: null } }).lean();

    if (productos.length === 0) {
      console.log('✅ No se encontraron productos para migrar.');
      return;
    }

    // Traer todas las marcas existentes para hacer búsquedas rápidas
    const marcas = await Marca.find().lean();
    
    // Mapa de marca en mayúsculas -> ObjectId
    const mapaMarcas = new Map();
    marcas.forEach((m) => {
      if (m.nombre) {
        mapaMarcas.set(m.nombre.toUpperCase().trim(), m._id);
      }
      if (m.codigo) {
        mapaMarcas.set(m.codigo.toUpperCase().trim(), m._id);
      }
    });

    let convertidos = 0;
    let omitidos = 0;
    let noEncontrados = 0;

    for (const prod of productos) {
      // Si la marca ya es un ObjectId de Mongoose y no un string
      if (prod.marca instanceof mongoose.Types.ObjectId) {
        omitidos++;
        continue;
      }

      const marcaString = String(prod.marca).trim();

      // Si el string guardado es ya un ObjectId válido de 24 caracteres hex
      if (mongoose.Types.ObjectId.isValid(marcaString) && marcaString.length === 24) {
        const existeMarcaPorId = marcas.some(m => m._id.toString() === marcaString);
        if (existeMarcaPorId) {
          await Producto.updateOne(
            { _id: prod._id },
            { $set: { marca: new mongoose.Types.ObjectId(marcaString) } }
          );
          convertidos++;
          continue;
        }
      }

      // Buscar coincidencia por nombre o código de marca
      const marcaId = mapaMarcas.get(marcaString.toUpperCase());

      if (marcaId) {
        await Producto.updateOne(
          { _id: prod._id },
          { $set: { marca: marcaId } }
        );
        convertidos++;
      } else {
        console.warn(`⚠️ Producto ID "${prod._id}": No se encontró marca para "${marcaString}"`);
        noEncontrados++;
      }
    }

    console.log(`✅ Migración finalizada: ${convertidos} actualizados, ${omitidos} ya eran ObjectId, ${noEncontrados} no encontrados.`);
  } catch (error) {
    console.error('❌ Error durante la migración de marcas en productos:', error);
  }
};

module.exports = migrarMarcasProductos;
