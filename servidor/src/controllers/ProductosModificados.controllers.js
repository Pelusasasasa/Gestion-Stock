const productosModificadosCTRL = {};

const Producto = require('../models/ProductosModificados');

//agregamos los productos modificados
productosModificadosCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    const yaCreado = await Producto.findOne({codigo:req.body.codigo});

    if (!yaCreado) {
        const modificado = new Producto(req.body);
        await modificado.save();
        console.log(`Se modifico el producto ${req.body.descripcion} con la fecha y hora ${(new Date()).toLocaleString()}`)
    }else{
        yaCreado.precio = req.body.precio;
        yaCreado.fecha = req.body.fecha;
        await Producto.findOneAndUpdate({codigo:yaCreado.codigo},yaCreado);
    };
    res.end();
};

//Traemos los productos modificados 
productosModificadosCTRL.getAll = async(req,res)=>{
    const productos = await Producto.find();
    res.send(productos);
};

//Traemos los productos modificados entre 2 fechas
productosModificadosCTRL.getForDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    const productos = await Producto.find({
        $and:[
            {fecha: {$gte:new Date(desde + "T00:00:00.000Z")}},
            {fecha: {$lte:new Date(hasta + "T23:59:59.000Z")}}

        ]
    });
    res.send(productos);
}

module.exports = productosModificadosCTRL