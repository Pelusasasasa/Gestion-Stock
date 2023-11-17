const movimientoCTRL = {}

const movProducto = require('../models/movProducto');

movimientoCTRL.modificarVarios = async(req,res)=>{
    const arreglo = req.body;
    for await(let movimiento of arreglo){
        await movProducto.findByIdAndUpdate({_id:movimiento._id},movimiento);
        console.log(`movimiento con el ID: ${movimiento._id} Modificado`);
    }
    res.send("moviemientos modificados");
}

movimientoCTRL.cargar = async(req,res)=>{
    for await(let movimiento of req.body){
        const now = new Date();
        movimiento.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        const movimientoAGuardar = new movProducto(movimiento);
        await movimientoAGuardar.save();
        console.log(`Movimiento con el id: ${movimiento._id} --- ${movimiento.producto} Cargado`);
    }
    res.send(`Movimientos cargados`);
};

movimientoCTRL.porRubro = async(req,res)=>{
    const {rubro,desde,hasta} = req.params;
    const productos = await movProducto.find({
        $and:[
            {rubro:rubro},
            {fecha:{$gte:new Date(desde)}},
            {fecha:{$lte:new Date(hasta + "T23:59:59")}}
        ]
    });
    res.send(productos);
};

movimientoCTRL.getforNumberAndCliente = async(req,res)=>{
    const {number,cliente} = req.params;
    const movimientos = await movProducto.find({
        $and:[
            {nro_venta:number},
            {cliente:cliente}
        ]
    });
    res.send(movimientos)
};

movimientoCTRL.porId = async(req,res)=>{
    const {id,tipoVenta} = req.params;
    const movimientos = await movProducto.find({nro_venta:id,tipo_venta:tipoVenta});
    res.send(movimientos)
};


movimientoCTRL.putForIdAndTipoVenta = async(req,res) => {
    const {id,tipoVenta} = req.params;
    const movimiento = await movProducto.findOneAndUpdate({nro_venta:id,tipo_venta:tipoVenta},req.body);
    res.send(movimiento);
};

module.exports = movimientoCTRL;