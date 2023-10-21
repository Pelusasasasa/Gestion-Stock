const {Router} = require('express');
const router = Router();

const {cargarHistorica,traerHistoricaPorCliente,traerHistorica,modificarHistorica, porNumberAndType, putForNumberAndType} = require('../controllers/cuentaCorrHistorica.controllers');


router.route('/')
    .post(cargarHistorica)
router.route('/traerPorCliente/:id')
    .get(traerHistoricaPorCliente)
router.route('/PorId/id/:id')
    .get(traerHistorica)
    .put(modificarHistorica)
router.route('/porNumberAndType/:number/:type')
    .get(porNumberAndType)
    .put(putForNumberAndType)

module.exports = router;