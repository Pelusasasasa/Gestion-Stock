const { Router } = require('express');
const router = Router();

const { traerNumeros, gargarNumeros, modificarNumeros, modificarNumero, traerNumero, actualizarDolar } = require('../controllers/numero.controllers');

router.route('/')
    .post(gargarNumeros)
    .get(traerNumeros)
    .put(modificarNumeros)
router.route('/dolar')
        .put(actualizarDolar)
router.route('/:numero')
    .get(traerNumero)
    .put(modificarNumero)

module.exports = router;