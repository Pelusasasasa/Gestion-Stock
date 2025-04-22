const historicaCTRL = {};

const Historica = require('../models/cuentaCorrHisto');


historicaCTRL.porNumberAndType = async (req, res) => {
    const { number, type } = req.params;
    const historica = await Historica.findOne({ nro_venta: number, tipo_comp: type });
    res.send(historica);
};

historicaCTRL.cargarHistorica = async (req, res) => {
    const ultimaHistorica = (await Historica.find({}, { _id: 1 }));
    let arreglo = ultimaHistorica.map((e) => {
        return e._id
    });
    let id = arreglo.length !== 0 ? Math.max(...arreglo) : 0;
    req.body._id = id + 1;
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const historica = new Historica(req.body);
    await historica.save();
    console.log(`Historica ${req.body.nro_venta} Guardada al cliente ${req.body.cliente}`);
    res.send(`Historica ${req.body._id} Guardada`);
};

historicaCTRL.modificarHistorica = async (req, res) => {
    const { id } = req.params;
    delete req.body._id;
    await Historica.findOneAndUpdate({ nro_venta: id }, req.body);
    console.log(`Ceunta Historica numero: ${req.body.nro_venta} Modificado al cliente ${req.body.cliente}`)
    res.send(`historica ${id} modificada`);
};

historicaCTRL.eliminarHistorica = async (req, res) => {
    const { numero } = req.params;

    try {
        const historica = await Historica.findOneAndDelete({ nro_venta: numero });
        res.status(200).json({
            ok: true,
            historica
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: ' No se pudo eliminar la historica hable con el administrador',
            ok: false,
            error: error
        })
    }


};

historicaCTRL.traerHistoricaPorCliente = async (req, res) => {
    const { id } = req.params;
    const historicas = await Historica.find({ idCliente: id });
    res.send(historicas);
}

historicaCTRL.traerHistorica = async (req, res) => {
    const { id } = req.params;
    const historica = await Historica.find({ nro_venta: id });
    res.send(historica[0]);
};

historicaCTRL.traerHistoricaDesdeYCliente = async (req, res) => {
    const { desde, codigo } = req.params;
    const historicas = await Historica.find({ fecha: { $gte: desde + "T00:00:00.000Z" }, idCliente: codigo });
    res.send(historicas);
};

historicaCTRL.putForNumberAndType = async (req, res) => {
    const { number, type } = req.params;
    await Historica.findOneAndUpdate({ nro_venta: number, tipo_comp: type }, req.body);
    res.end();
};



module.exports = historicaCTRL;
