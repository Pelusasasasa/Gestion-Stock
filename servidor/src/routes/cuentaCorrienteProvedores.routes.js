const { Router } = require('express');
const { getCuentaCorrienteProvedores, putCuentaCorrienteProvedores, deleteCuentaCorrienteProvedores } = require('../controllers/cuentacorrienteProvedores.controller');

const router = Router();

router.get('/:id/:desde/:hasta', getCuentaCorrienteProvedores);
router.put('/:id', putCuentaCorrienteProvedores);
router.delete('/:id', deleteCuentaCorrienteProvedores);

module.exports = router;
