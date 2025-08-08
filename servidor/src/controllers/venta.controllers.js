const ventaCTRL = {};

const Venta = require('../models/Venta');
const funcion = require('../assets/js/pdf');
const { sumarSaldoCliente } = require('../helpers/sumarSaldoCliente');
const { actualizarNumero } = require('../helpers/actualizarNumero');
const { descontarStock } = require('../helpers/descontarStock');
const { crearMovimientosStock } = require('../helpers/crearMovimientosStock');
const { crearCompensada } = require('../helpers/crearCompensada');
const { crearHistorica } = require('../helpers/crearHistorica');

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
    try {
        const venta = new Venta(req.body);

        const numeroActualizado = await actualizarNumero(venta.tipo_venta);
        if(numeroActualizado.ok){
            venta.numero = numeroActualizado.numero
        };

        if(venta.tipo_venta === 'CC'){
            const saldoModficado =  await sumarSaldoCliente(venta.idCliente, venta.precio);
            if(!saldoModficado.ok) return res.status(400).json({
                msg: "Error al modificar el saldo del cliente",
                ok: false
            }); 

            const compensada = await crearCompensada(venta);
            if(!compensada) return res.status(400).json({
                msg: "Error al crear la compensada",
                ok: false
            });

            const historica = await crearHistorica(venta);
            if(!historica) return res.status(400).json({
                msg: "Error al crear la historica",
                ok: false
            });
        };

        if(venta.tipo_venta !== 'PP'){
            const stockDescontado = await descontarStock(req.body.listaProductos);
            if(!stockDescontado) return res.status(400).json({
                ok: false,
                msg: "Error al descontar el stock"
            });
        };

        const movimientos = await crearMovimientosStock(req.body.listaProductos, venta);
        if(!movimientos) return res.status(400).json({
            ok: false,
            msg: "Error al crear los movimientos"
        });

        await venta.save();
        if (req.body.F) {
            funcion.crearPDF(req.body);//creamos un pdf con la venta
        };

        const nuevaVenta = await Venta.findOne({_id:venta._id})
            .populate('vendedor', 'nombre');

        console.log(`Venta con el numero: ${venta.numero} Cargada`);
        res.status(201).json({
            ok: true,
            venta: nuevaVenta,
            movimientos,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al cargar la venta, hable con el administrador"
        });
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
    }).populate('vendedor', 'nombre');
    res.send(ventas);
};

ventaCTRL.ventasMes = async(req,res)=>{
    const {fecha} = req.params;
    let mes = parseFloat(fecha);
    mes = mes>12 ? 1 : mes;
    let hoy = new Date();
    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`);
    let fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes===12 ? 1 : mes + 1}-1`);
    const ventas = await Venta.find({
    $and:[
        {fecha:{$gte:new Date(fechaConMes)}},
        {fecha:{$lte:new Date(fechaConMesSig)}}
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