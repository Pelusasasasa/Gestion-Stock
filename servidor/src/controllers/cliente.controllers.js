const clienteCTRL = {};

const Clientes = require('../models/Cliente');

clienteCTRL.getsClientes = async(req,res)=>{
    const {nombre} = req.params;
    let clientes
    if (nombre === "NADA" ) {
        clientes = await Clientes.find().sort({nombre:1}).limit(50);
    }else{
        const re = new RegExp(`^${nombre}`);
        clientes = await Clientes.find({nombre:{$regex: re,$options: "i"}}).sort({nombre:1}).limit(50);
    }
    res.send(clientes);
}

clienteCTRL.id = async(req,res)=>{
    const ultimoCliente = (await Clientes.find({},{_id:1}));
    let arreglo = ultimoCliente.map((e)=>{
        return e._id
    });
    let id = arreglo.length !== 0 ?  Math.max(...arreglo) : 0;
    res.send(`${id + 1}`);

}

clienteCTRL.getClienteId = async(req,res)=>{
    const {id} = req.params;
    const cliente = (await Clientes.findOne({_id:id}));
    res.send(cliente);
}

clienteCTRL.cargarCliente = async(req,res)=>{
    let cliente;
    let mensaje;
    let estado;

    try {
        cliente = new Clientes(req.body);
        await  cliente.save();
        mensaje = (`Cliente ${cliente.nombre} Cargado`);
        estado = true;
    } catch (error) {
        estado = false;
        mensaje = (`Cliente ${cliente.nombre} No Fue Cargado`)
        console.log(error)
    };
    
    res.send(JSON.stringify({
        mensaje,
        estado,
        cliente
    }))
}

clienteCTRL.modificarCliente = async(req,res)=>{
    const {id} = req.params;
    let mensaje;
    let estado;
    try {
        const cliente = await Clientes.findOneAndUpdate({_id:id},req.body);
        estado = true;
        console.log(`Cliente ${cliente.nombre} Modificado`);
        mensaje = `Cliente ${cliente.nombre} Modificado`;
    } catch (error) {
        estado = false;
        mensaje = `Cliente ${cliente.nombre} No fue Modificado`;
        console.log(error);
    };

    res.send(JSON.stringify({
        mensaje,estado
    }));
}

clienteCTRL.eliminarCliente = async(req,res) =>{
    const {id} = req.params;
    const cliente = await Clientes.findOneAndRemove({_id:id});
    console.log(`Cliente ${cliente.nombre} Eliminado`)
    res.send(`Cliente ${cliente.nombre} Eliminado`);
}

clienteCTRL.traerClienteConSaldo = async(req,res)=>{
    const clientes = await Clientes.find({saldo:{$not:{$eq:0}}})
    res.send(clientes)
}


module.exports = clienteCTRL;