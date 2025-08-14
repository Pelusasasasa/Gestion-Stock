const reciboCTRL = {};

const { actualizarCompensadas } = require('../helpers/actualizarCompensadas');
const { actualizarNumero } = require('../helpers/actualizarNumero');
const { cambiarSaldoCliente } = require('../helpers/cambiarSaldoCliente');
const { cargarMovsRecibos } = require('../helpers/cargarMovsRecibos');
const { crearHistorica } = require('../helpers/crearHistorica');
const Recibo = require('../models/Recibo');


reciboCTRL.cargarRecibo = async(req,res)=>{
    try {
        
        const nuevoRecibo = new Recibo(req.body);
        
        const numeroActualizado = await actualizarNumero(nuevoRecibo.tipo_venta)
        if(numeroActualizado.ok){
            nuevoRecibo.numero = numeroActualizado.numero;
        }else{
            return res.status(400).json({
                ok: false,
                msg: "Error al actualizar el numero del recibo"
            });
        };
        
        const saldoModificado = await cambiarSaldoCliente(nuevoRecibo.idCliente, nuevoRecibo.precio, true);
        if(!saldoModificado.ok){
            return res.status(400).json({
                ok: false,
                msg: "Error al modificar el saldo del cliente"
            });
        };
    
        const historica = await crearHistorica(nuevoRecibo);
        if(!historica){
            return res.status(400).json({
                ok: false,
                msg: "Error al crear la historica"
            });
        };
        
        const compensadasModificadas = await actualizarCompensadas(req.body.compensadas);
    
        if(!compensadasModificadas.ok) return res.status(400).json({
            ok: false,
            msg: 'Error al modificar las compensadas'
        });
        
        const movsRecibos = await cargarMovsRecibos(compensadasModificadas.compensadas, numeroActualizado.numero);
        if(!movsRecibos.ok) return res.status(400).json({
            ok: false,
            msg: 'Error al cargar los movimientos de los recibos'
        });
        await nuevoRecibo.save();
        res.status(201).json({
            ok: true,
            recibo: nuevoRecibo,
            movsRecibos: movsRecibos.movs,
            cliente: saldoModificado.cliente
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo realizar el recibo, hable con el administrador'
        })
    }
}

reciboCTRL.recibosDia = async(req,res)=>{
    const {fecha} = req.params;
    const iniciodia = new Date(fecha + "T00:00:00.000Z");
    const findia = new Date(fecha + "T23:59:59.999Z");
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:iniciodia}},
            {fecha:{$lte:findia}}
        ]
    })
    res.send(recibos);
};

reciboCTRL.recibosMes = async(req,res)=>{
    const {fecha} = req.params;
    let mes = parseFloat(fecha);
    let hoy = new Date();
    mes = mes>12 ? 1 : mes;

    let fechaConMes = new Date(`${hoy.getFullYear()}-${mes}-1`)
    let fechaConMesSig = new Date(`${mes === 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()}-${mes === 12 ? 1 : mes + 1}-1`);
    console.log(fechaConMesSig)
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:fechaConMes}},
            {fecha:{$lte:fechaConMesSig}}
        ]
    });
    console.log(recibos)
    res.send(recibos);
};

reciboCTRL.recibosAnio = async(req,res)=>{
    const {fecha} = req.params;
    const hoy = new Date();
    const esteAnio = new Date(`${fecha}-1-1`);
    const anioSig = new Date(`${parseFloat(fecha) + 1}-1-1`);
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:esteAnio}},
            {fecha:{$lte:anioSig}}
        ]
    });
    res.send(recibos);
};

reciboCTRL.getForNumber = async(req,res)=>{
    const {number} = req.params;
    console.log(number)
    const recibo = await Recibo.findOne({numero:number});
    res.send(recibo)
};

module.exports = reciboCTRL;