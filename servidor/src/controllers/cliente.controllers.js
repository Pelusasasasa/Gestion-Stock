const clienteCTRL = {};

const Clientes = require('../models/Cliente');

clienteCTRL.getsClientes = async (req, res) => {
    const { nombre } = req.params;
    let clientes
    if (nombre === "NADA") {
        clientes = await Clientes.find().sort({ nombre: 1 }).limit(50);
    } else {
        const re = new RegExp(`^${nombre}`);
        clientes = await Clientes.find({ nombre: { $regex: re, $options: "i" } }).sort({ nombre: 1 }).limit(50);
    }
    res.send(clientes);
}

clienteCTRL.id = async (req, res) => {
    const ultimoCliente = (await Clientes.find({}, { _id: 1 }));
    let arreglo = ultimoCliente.map((e) => {
        return e._id
    });
    let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
    res.send(`${id + 1}`);

}

clienteCTRL.getClienteId = async (req, res) => {
    const { id } = req.params;
    const cliente = (await Clientes.findOne({ _id: id }));
    res.send(cliente);
}

clienteCTRL.cargarCliente = async (req, res) => {
    try {
        const cliente = new Clientes(req.body);
        await cliente.save();

        if(!cliente)return res.status(404).json({
            ok: false,
            msg: 'No se pudo cargar el cliente'
        });


        res.status(201).json({
            ok: true,
            cliente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo cargar el cliente, Hable con el administrador'
        });
    };
}

clienteCTRL.modificarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        let cliente = await Clientes.findOneAndUpdate({ _id: id }, req.body, {new: true});

        if(!cliente)return res.status(404).json({
            ok: false,
            msg: 'No se existe el cliente'
        });

        console.log(`Cliente ${cliente.nombre} Modificado`);
        res.status(200).json({
            ok: true,
            cliente
        });
        
    } catch (error) {      
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el cliente, Hable con el administrador'
        });
    };
};

clienteCTRL.eliminarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Clientes.findOneAndDelete({ _id: id });
    console.log(`Cliente ${cliente.nombre} Eliminado`)
    res.send(`Cliente ${cliente.nombre} Eliminado`);
}

clienteCTRL.traerClienteConSaldo = async (req, res) => {
    const clientes = await Clientes.find({ saldo: { $not: { $eq: 0 } } })
    res.send(clientes)
}


module.exports = clienteCTRL;