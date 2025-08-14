const { Router } = require('express');
const { getSaldoInicial } = require('../controllers/saldoMensual.controllers');

const router = Router();

router.route('/')
    .get(getSaldoInicial)

module.exports = router;