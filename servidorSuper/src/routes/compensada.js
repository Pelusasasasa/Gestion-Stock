const {Router} = require('express');
const router = Router();


const {crearCompensda,traerPorCliente,traerCompensada,modificarCompensada,eliminarCuenta} = require('../controllers/cuentaCorrComp.controllers');

router.route('/')
    .post(crearCompensda)
router.route('/traerCompensadas/:id')
    .get(traerPorCliente)
router.route('/traerCompensada/id/:id')
    .get(traerCompensada)
    .put(modificarCompensada)
    .delete(eliminarCuenta)
module.exports = router;