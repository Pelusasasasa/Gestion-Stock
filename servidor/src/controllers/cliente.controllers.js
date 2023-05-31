const clienteCTRL = {};

const Clientes = require('../models/Cliente');

clienteCTRL.getsClientes = async(req,res)=>{
    const {nombre} = req.params;
    let clientes
    if (nombre === "NADA" ) {
        clientes = await Clientes.find().sort({nombre:1});
    }else{
        const re = new RegExp(`^${nombre}`);
        clientes = await Clientes.find({nombre:{$regex: re,$options: "i"}}).sort({nombre:1});
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
    req.body.nombre = req.body.nombre.toUpperCase();
    req.body.localidad !== "" && (req.body.localidad = req.body.localidad.toUpperCase());
    req.body.localidad !== "" && (req.body.direccion = req.body.direccion.toUpperCase());
    try {
        cliente = new Clientes(req.body);
        await  cliente.save();
        mensaje = (`Cliente ${cliente.nombre} Cargado`);
        estado = true;
    } catch (error) {
        estado = false;
        if (cliente.nombre === "") {
            mensaje = (`Cliente No Cargado, Falta el nombre`)
        }else{
            mensaje = (`Cliente ${cliente.nombre} No Fue Cargado`)
        }
    }
    res.send(JSON.stringify({
        mensaje,
        estado
    }))
}

clienteCTRL.modificarCliente = async(req,res)=>{
    const {id} = req.params;
    const cliente = await Clientes.findOneAndUpdate({_id:id},req.body);
    console.log(`Cliente ${cliente.nombre} Modificado`);
    res.send(`Cliente ${cliente.nombre} Modificado`);
}

clienteCTRL.eliminarCliente = async(req,res) =>{
    const {id} = req.params;
    const cliente = await Clientes.findOneAndDelete({_id:id});
    console.log(`Cliente ${cliente.nombre} Eliminado`)
    res.send(`Cliente ${cliente.nombre} Eliminado`);
}

clienteCTRL.traerClienteConSaldo = async(req,res)=>{
    const clientes = await Clientes.find({saldo:{$not:{$eq:0}}})
    res.send(clientes)
}


module.exports = clienteCTRL;