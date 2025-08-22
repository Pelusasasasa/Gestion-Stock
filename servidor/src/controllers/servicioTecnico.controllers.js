const servicioCTRL = {};

const { actualizarNumero } = require('../helpers/actualizarNumero');
const { modificarEquipos, cargarEquipos } = require('../helpers/cargarEquipos');
const EquipoServicio = require('../models/EquipoServicio');
const Servicio = require('../models/ServicioTecnico');

servicioCTRL.EliminarPorID = async(req, res) => {
    const {id} = req.params;

    try {
        const servicio = await Servicio.findByIdAndUpdate(id, { activo: false});

        res.status(200).json({
            ok: true,
            msg: `Servicio con el numero ${servicio.numero} Eliminado correctamente`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el servicio'
        })
    }
};

servicioCTRL.crearServicio = async(req, res)=>{
    const { equipos } = req.body;
    try {

        const numero = await actualizarNumero('SR');
        if(!numero) return res.status(404).json({
            ok: false,
            msg: 'No se pudo modificar el numero'
        });

        console.log(numero)
        req.body.numero = numero.Servicio;

        const servicio = new Servicio(req.body);
    
        const equiposCargados = await cargarEquipos(equipos);
        if(!equiposCargados){
            return res.status(500).json({
                ok: false,
                msg: 'No se pudo cargar los equipos'
            });
        };

        await servicio.save();

        res.status(201).json({
            ok: true,
            servicio,
            equiposCargados
        });

    } catch (error) {
        console.error(error)
        res.status(500).send({
            ok: false,
            msg: 'No se pudo cargar el servicio'
        });
    }
};

servicioCTRL.traerPorId = async(req, res) => {

    try {
        const servicio = await Servicio.findById(req.params.id)
            .populate('vendedor', ['nombre', 'permiso']);
        
        const equipos = await EquipoServicio.find({numero: servicio.numero});

        res.status({
            ok: true,
            servicio,
            equipos
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'No se pud obtener los servicios'
        })
    };
};

servicioCTRL.ModificarPorId = async(req, res) => {
    const {id} = req.params;
    const { equipos } = req.body;
    try {
        const servicio = await Servicio.findByIdAndUpdate(id, req.body);
        if(!servicio){
            res.status(404).json({
                ok: false,
                msg: 'No existe el servicio tecnico'
            })
        };

        const equiposModificados = await modificarEquipos(equipos);

        if(!equiposModificados) return res.status(404).json({
            ok: false,
            msg: 'No se pudo modificar los equipos'
        });

        res.status(200).json({
            ok: true,
            servicio,
            equiposModificados
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el servicio tecnico'
        })
    }
};

servicioCTRL.traerActivos = async(req,res)=>{
    try {
        const servicios = await Servicio.find({estado: true})
            .populate('vendedor', ['nombre', 'permiso']);

            res.status(200).json({
                ok: true,
                servicios
            })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener los servicios'
        })
    }

};

servicioCTRL.modificarEstado = async(req, res) => {
    const { id } = req.params;

    try {
        const servicioModificado = await Servicio.findByIdAndUpdate(id, {estado: req.body}, {new: true});
        if(!servicioModificado) return res.status(404).json({
            ok: false,
            msg: 'No existe el servicio'
        });

        res.status(200).json({
            ok: true,
            servicioModificado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo modificar el estado, hable con el administrador'
        });
    };
};

//TODO
servicioCTRL.getForText = async(req, res) => {
    const {text} = req.params;
    if (text !== 'vacio') {
        const re = new RegExp(`^${text}`);
    
        const servicios = await Servicio.find({
            $or: [
                {producto:{$regex:re, $options: 'i'}},
                {marca:{$regex:re, $options: 'i'}},
                {modelo:{$regex:re, $options: 'i'}},
                {cliente:{$regex:re, $options: 'i'}},
            ]
        })
        .populate('vendedor', ['nombre', 'permiso'])
        .populate('idCliente', ['nombre', 'telefono', 'direccion'])
        .populate('codProd', ['producto', 'marca', 'descripcion']);

        res.send(servicios);
    }else{
        const servicios = await Servicio.find();
        res.send(servicios);
    }

};

module.exports = servicioCTRL;