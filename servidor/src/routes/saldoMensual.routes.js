const { Router } = require('express');
const { getSaldoInicial, getAll, postNew, patchOne } = require('../controllers/saldoMensual.controllers');

const router = Router();

router.route('/').get(getSaldoInicial);
router.route('/all').get(getAll);
router.route('/').post(postNew);
router.route('/:id').patch(patchOne);

module.exports = router;
