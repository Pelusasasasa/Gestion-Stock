const { Router } = require('express');
const { postOne, getAll, getforid, putPasado, patchObservaciones } = require('../controllers/remito.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/forId/:id')
    .get(getforid)
router.route('/pasado/:id')
    .put(putPasado)
router.route('/observaciones/:id')
    .patch(patchObservaciones)

module.exports = router;