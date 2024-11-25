const { Router } = require('express');
const { postOne, getAll, getforid, putPasado } = require('../controllers/remito.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/forId/:id')
    .get(getforid)
router.route('/pasado/:id')
    .put(putPasado)

module.exports = router;