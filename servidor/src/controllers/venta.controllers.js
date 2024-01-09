const ventaCTRL = {};

const Venta = require('../models/Venta');
const funcion = require('../assets/js/pdf');

ventaCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const venta = await Venta.find({numero:id});
    res.send(venta[0]);
};

ventaCTRL.putForId = async(req,res)=>{
    const {id,tipo} = req.params;
    delete req.body._id;
    const venta = await Venta.findOneAndUpdate({numero:id,tipo_venta:tipo},req.body);
    res.send(`Venta ${id} actualizada`);
};

ventaCTRL.cargarVenta = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    try {
        const venta = new Venta(req.body);
        await venta.save();
        if (req.body.F) {
            funcion.crearPDF(req.body);//creamos un pdf con la venta
        }

        console.log(`Venta con el numero: ${venta.numero} Cargada`);
        res.send(res);
    } catch (error) {
        res.send(error.errors);
    }
};

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
};

ventaCTRL.ventasMes = async(req,res)=>{
    const {fecha} = req.params;
    let mes;
    let hoy = new Date();
    let fechaConMes;
    let fechaConMesSig;
    console.log(fecha)
    if (fecha.length === 7) {
        let year = parseInt(fecha.slice(0,4));
        mes = parseInt(fecha.slice(5,7));
        fechaConMes = new Date(`${year}-${mes}-1`);
        fechaConMesSig = new Date(`${mes == 12 ? year + 1 : year}-${mes == 12 ? 1 : mes + 1}-1`);
    }else{
        mes = parseFloat(fecha);
        mes = mes>12 ? 1 : mes;
        fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
        fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes===12 ? 1 : mes + 1}-1`);
    }
    
    try {
        const ventas = await Venta.find({
            $and:[
                {fecha:{$gte:new Date(fechaConMes)}},
                {fecha:{$lte:new Date(fechaConMesSig)}}
            ]
        });
        res.send(ventas);
    } catch (error) {
        console.log(error)
        res.send([])
    }
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

ventaCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await Venta.findOneAndRemove({_id:id});
    console.log(`Venta ${id} Eliminada`)
    res.send(`Venta ${id} Eliminada`);
}

ventaCTRL.getForNumberAndType = async(req,res)=>{
    const {numero,tipo} = req.params;
    const venta = await Venta.findOne({numero:numero,tipo_venta:tipo});
    res.send(venta);
};

ventaCTRL.getbetweenDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    const aux = hasta.split('-',3);
    let finDia = new Date(aux[0],aux[1] - 1,aux[2],20,59,59,0);
    const ventas = await Venta.find({$and:[
        {fecha:{$gte:desde}},
        {fecha:{$lte:finDia}},
        {tipo_comp:{$ne:"Comprobante"}}
    ]});
    res.send(ventas);
};

module.exports = ventaCTRL;