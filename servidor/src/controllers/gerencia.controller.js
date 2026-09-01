const { actualizarNumero } = require("../helpers/actualizarNumero");
const Gerencia = require('../models/Gerencia');
const NroSerie = require('../models/NroSerie');
const Movimiento = require('../models/movProducto')

const gerenciaCTRL = {};

gerenciaCTRL.realizarGerencia = async(req, res) => {
    try {
        const { gerencia, productos } = req.body;

        //1.Actualizar Numero
        const numero = await actualizarNumero(gerencia.tipo_venta);
        if(!numero.ok){
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar el numero'
            })
        };

        gerencia.numero = numero.numero;

        // 3. Cargar Gerencia
        const gerenciaCargada = new Gerencia(gerencia);
        await gerenciaCargada.save();

        if(!gerenciaCargada){
            return res.status(400).json({
                ok: false,
                msg: 'Error al cargar la gerencia, pero si se actualizo el numero'
            })
        }

        let movimientos = [];
        for(let i = 0; i < productos.length; i++){
         //4. cargar Movimiento de producto
         const movimiento = new Movimiento({
                   fecha: gerenciaCargada.fecha,
                   tipo_venta: gerenciaCargada.tipo_venta,
                   cliente: gerenciaCargada.idCliente,
                   nombreCliente: gerenciaCargada.cliente,
                   marca: productos[i].marca,
                   codProd: productos[i]._id,
                   producto: productos[i].descripcion,
                   cantidad: productos[i].cantidad,
                   iva: productos[i].impuesto,
                   precio: productos[i].precio,
                   nro_venta: gerenciaCargada.numero,
                   tipo_comp: gerenciaCargada.tipo_comp,
                   series: productos[i].series
                     
                 })
         
                 await movimiento.save();
                 movimientos.push(movimiento);

                //5. Cargar Series
                if(productos[i].series){
                                  const serie = new NroSerie({
                                    fecha: gerenciaCargada.fecha,
                                    codigo: productos[i]._id,
                                    producto: productos[i].descripcion,
                                    nro_serie: productos[i].series,
                                    factura: gerenciaCargada.tipo_comp,
                                    vendedor: gerenciaCargada.vendedor
                                  });
                        
                                  await serie.save();
                                  if(!serie){
                                    console.error('Error al guardar la serie');
                                    return res.status(400).json({
                                      ok:false,
                                      msg: 'Error al guardar la serie, pero si se actualizo el numero y se cargo la gerencia y se descontó el stock y se cargó el movimiento'
                                    })
                                  }
                                }
        }
        
        return res.status(201).json({
          ok: true,
          gerencia: gerenciaCargada,
          movimientos,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al realizar la gerencia, hable con el administrador'
        })
    }
};

gerenciaCTRL.obtenerGerencias = async(req, res) => {
  const { desde, hasta }= req.query;
  const desdeDate = new Date(desde);
  const hastaDate = new Date(hasta);
  console.log(desdeDate, hastaDate)
    try {
        const gerencias = await Gerencia.find({fecha: {$gte: desdeDate, $lte: hastaDate}});
        return res.status(200).json({
            ok: true,
            gerencias,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener las gerencias, hable con el administrador'
        })
    }
};

module.exports = gerenciaCTRL;