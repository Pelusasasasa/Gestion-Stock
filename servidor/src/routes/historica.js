const {Router} = require('express');
const router = Router();

const {cargarHistorica,traerHistoricaPorCliente,traerHistorica,modificarHistorica, putForClientAndNumber} = require('../controllers/cuentaCorrHistorica.controllers');


router.route('/')
    .post(cargarHistorica)
router.route('/traerPorCliente/:id')
    .get(traerHistoricaPorCliente)
router.route('/PorId/id/:id')
    .get(traerHistorica)
    .put(modificarHistorica)
router.route('/PorNumeroAndCliente/:numero/:idCliente')
    .put(putForClientAndNumber)

module.exports = router;