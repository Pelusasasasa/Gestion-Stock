const {Router} = require('express');
const router = Router();

const {getLastNumero, getMarcas, postMarca, putMarca, deleteMarca} = require('../controllers/marca.controllers');

router.route('/')
    .get(getMarcas)
    .post(postMarca)

router.route('/last')
    .get(getLastNumero)

router.route('/numero/:numero')
    .put(putMarca)
    .delete(deleteMarca)

module.exports = router;