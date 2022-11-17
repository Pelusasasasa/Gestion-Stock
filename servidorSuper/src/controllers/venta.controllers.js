const ventaCTRL = {};

const Venta = require('../models/Venta');
const funcion = require('../assets/js/pdf');

ventaCTRL.getVenta = async(req,res)=>{
    const {id,tipo} = req.params;
    const venta = await Venta.find({numero:id,tipo_venta:tipo});
    res.send(venta[0]);
}

ventaCTRL.modificarVenta = async(req,res)=>{
    const {id,tipo} = req.params;
    delete req.body._id;
    const venta = await Venta.findOneAndUpdate({numero:id,tipo_venta:tipo},req.body);
    res.send(`Venta ${id} actualizada`);
}
ventaCTRL.cargarVenta = async(req,res)=>{
    const venta = new Venta(req.body);
    await venta.save();
    if (req.body.F) {
        funcion.crearPDF(req.body);//creamos un pdf con la venta
    }

    console.log(`Venta con el numero: ${venta.numero} Cargada`);
    res.send("Venta Guardada");
}

ventaCTRL.VentasDia = async(req,res)=>{
    const {fecha} = req.params;
    const inicioDia = new Date(fecha + "T00:00:00.000Z");
    const finDia = new Date(fecha + "T23:59:59.999Z");
    const ventas = await Venta.find({
        $and:[
            {fecha:{$gte:inicioDia}},
            {fecha:{$lte:finDia}}
        ]
    
    });
    res.send(ventas);
}

ventaCTRL.ventasMes = async(req,res)=>{
    const {fecha} = req.params;
    let mes = parseFloat(fecha);
    mes = mes>12 ? 1 : mes;
    let hoy = new Date();
    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
    let fechaConMesSig = new Date(`${hoy.getFullYear()}-${mes===12 ? 1 : mes + 1}-1`);
    const ventas = await Venta.find({
    $and:[
        {fecha:{$gte:fechaConMes}},
        {fecha:{$lte:fechaConMesSig}}
    ]
}); 
    res.send(ventas);
};

ventaCTRL.ventaAnio = async(req,res)=>{
    const {fecha} = req.params;
    const hoy = new Date();
    const esteAnio = new Date(`${fecha}-1-1`);
    const anioSig = new Date(`${parseFloat(fecha) + 1}-1-1`);
    const ventas = await Venta.find({
        $and:[
            {fecha:{$gte:esteAnio}},
            {fecha:{$lte:anioSig}}
        ]
    });
    res.send(ventas);
}

ventaCTRL.deleteVenta = async(req,res)=>{
    const {id,tipo} = req.params;
    console.log(id)
    console.log(tipo)
    await Venta.findOneAndDelete({_id:id,tipo_venta:tipo});
    console.log(`Venta ${id} Eliminada`)
    res.send(`Venta ${id} Eliminada`);
}

module.exports = ventaCTRL;