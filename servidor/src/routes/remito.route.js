const { Router } = require('express');
const { postOne, getAll, getforid, putPasado, patchObservaciones, cargarRemitoManoObra, realizarRemito } = require('../controllers/remito.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/realizarRemito').post(realizarRemito)
router.route('/mano-obra')
    .post(cargarRemitoManoObra)
router.route('/forId/:id')
    .get(getforid)
router.route('/pasado/:id')
    .put(putPasado)
router.route('/observaciones/:id')
    .patch(patchObservaciones)

module.exports = router;