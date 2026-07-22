const movimientoCTRL = {}

const ManoObra = require('../models/ManoObra');
const movProducto = require('../models/movProducto');
const Producto = require('../models/producto');

movimientoCTRL.deleteForIdAndTipo = async (req, res) => {

    const { tipoVenta, id } = req.params;

    try {
        const movs = await movProducto.findOneAndDelete({ nro_venta: id, tipo_venta: tipoVenta });

        res.status(200).json({
            ok: true,
            movs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar los movimientos de productos',
            error
        })
    }

};

movimientoCTRL.modificarVarios = async (req, res) => {
    const arreglo = req.body;
    let movs = [];
    try {
        for await (let movimiento of arreglo) {
            const mov = await movProducto.findByIdAndUpdate({ _id: movimiento._id }, movimiento, {new: true});
            console.log(`movimiento con el ID: ${movimiento._id} Modificado`);
            movs.push(mov);
        };
        res.status(200).json({
            ok: true,
            movs
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: true,
            msg: 'No se pudo modificar los movimientos',
            error
        })
    }
};

movimientoCTRL.cargar = async (req, res) => {
    let ultimoID = (await movProducto.find({}, { _id: 1 }));
    let arreglo = ultimoID.map((e) => {
        return e._id;
    });
    let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
    console.log(`ID inicial del movimiento es: ${id}`);
    for await (let movimiento of req.body) {
        id++;
        movimiento._id = id;
        const now = new Date();
        movimiento.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        const movimientoAGuardar = new movProducto(movimiento);
        await movimientoAGuardar.save();
        console.log(`Movimiento con el id: ${movimiento._id} --- ${movimiento.producto} Cargado`);
    }
    res.send(`Movimientos cargados`);
};

movimientoCTRL.porId = async (req, res) => {
    const { id, tipoVenta } = req.params;
    const movimientos = await movProducto.find({ nro_venta: id, tipo_venta: tipoVenta });
    res.send(movimientos)
};

movimientoCTRL.traerPorProducto = async(req, res) => {
    const { codigo } = req.params;
    try {
        const movimientos = await movProducto.find({codProd: codigo}).sort({fecha: -1});

        res.status(200).json({
            ok: true,
            movimientos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener los movimientos de Productos, hable con el administrador'
        })
    }
};

movimientoCTRL.porRubro = async (req, res) => {
    const { rubro, desde, hasta } = req.params;
    const productos = await movProducto.find({
        $and: [
            { rubro: rubro },
            { fecha: { $gte: new Date(desde) } },
            { fecha: { $lte: new Date(hasta) } }
        ]
    });
    res.send(productos);
};

movimientoCTRL.post = async (req, res) => {
    const movimiento = req.body;

    const now = new Date();
    movimiento.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const movimientoAGuardar = new movProducto(movimiento);
    await movimientoAGuardar.save();


    res.send(`Movimiento con el id ${movimientoAGuardar._id} de tipo ${movimientoAGuardar.tipo_comp} a la hora ${(new Date()).toLocaleString()}`);

};

movimientoCTRL.postManoObra = async (req, res) => {
    
    const movimientos = req.body;

    try {
        for (const elem of movimientos) {
            const { fecha, tipo_venta, cliente, nombreCliente, marca, codProd, producto, rubro, cantidad, iva, precio, nro_venta, tipo_comp, manoObra } = elem;
            
            const productoTraido = await Producto.findOne({ _id: codProd.toString() });

            if (!productoTraido) return res.status(404).json({
                ok: false,
                msg: 'No se encontro el producto'
            })

            await ManoObra.findByIdAndUpdate({_id: manoObra}, {activo: false, estado: 'Remitado'}, {new: true});

            const movimiento = movProducto({
                fecha,
                tipo_venta, 
                cliente, 
                nombreCliente,
                marca,
                codProd,
                producto: productoTraido.descripcion,
                rubro: productoTraido.rubro,
                cantidad,
                iva: productoTraido.impuesto, 
                precio: productoTraido.precio,
                nro_venta,
                tipo_comp
            });

            await movimiento.save();
        }

        res.status(200).json({
            ok: true,
            msg: 'Movimientos cargados correctamente'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo cargar el movimiento, hable con el administrador'
        })
    }
}

movimientoCTRL.modificar = async(req, res) => {
    const { id , tipoVenta } = req.params;
    try {
        const movimiento = await movProducto.findOneAndUpdate({
            _id: id,
            tipo_venta: tipoVenta
        },
        { $set: req.body },
        {new: true}
    );

    if(!movimiento) return res.status(404).json({
        ok: false,
        msg: 'No se encontro el movimiento'
    })

    res.status(200).json({
        ok: true,
        movimiento
    })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el movimiento, hable con el administrador'
        })
    }
};

module.exports = movimientoCTRL;