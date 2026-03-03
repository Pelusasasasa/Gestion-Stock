const { Router } = require('express');
const { postPagoProvedor } = require('../controllers/pagoProvedores.controller');

const router = Router();

router.post('/', postPagoProvedor);

module.exports = router;
