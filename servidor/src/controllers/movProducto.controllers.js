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
    let ultimoMovimiento = await movProducto.findOne().sort({$natural:-1});
    let codigo = ultimoMovimiento.codigo + 1;
    console.log("EL codigo inicial es: " + codigo);
    for await(let movimiento of req.body){
        movimiento.codigo = codigo;
        codigo++;
        const now = new Date();
        movimiento.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        const movimientoAGuardar = new movProducto(movimiento);
        await movimientoAGuardar.save();
        console.log(`Movimiento con el codigo: ${movimiento.codigo} --- ${movimiento.producto} Cargado`);
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

movimientoCTRL.getForNroVentaAndTipoVenta = async(req,res)=>{
    const {nro_venta,tipoVenta} = req.params;
    const movimientos = await movProducto.find({nro_venta:nro_venta,tipo_venta:tipoVenta});
    res.send(movimientos)
};

movimientoCTRL.putForCodigoAndTipoVenta = async(req,res) => {
    const {id,tipoVenta} = req.params;
    let movimiento = await movProducto.findOneAndUpdate({codigo:id,tipo_venta:tipoVenta},req.body);
    res.send(movimiento);
};

movimientoCTRL.setCodigo = async(req,res) => {
    let i = 0;
    const movimientos = await movProducto.find();
    for await(let movimiento of movimientos){
        i++;
        movimiento.codigo = i;
        console.log(movimiento)
        await movimiento.updateOne({$set:{codigo:i}});
        
    };
    res.send('listo')
};

module.exports = movimientoCTRL;