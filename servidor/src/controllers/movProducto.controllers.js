const movimientoCTRL = {}

const movProducto = require('../models/movProducto');

movimientoCTRL.deleteForIdAndTipo = async (req, res) => {

    const { tipoVenta, id } = req.params;

    try {
        const movs = await movProducto.findOneAndDelete({ nro_venta: id, tipo_venta: tipoVenta });

        res.status(200).json({
            ok: true,
            movs
        });
    } catch (error) {
        console.log(error);
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
        console.log(error);
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

    console.log(movimientoAGuardar)

    res.send(`Movimiento con el id ${movimientoAGuardar._id} de tipo ${movimientoAGuardar.tipo_comp} a la hora ${(new Date()).toLocaleString()}`);

};

module.exports = movimientoCTRL;