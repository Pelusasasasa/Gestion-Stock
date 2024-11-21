const { Router } = require('express');
const router = Router();


const {getCuentas, postCuenta, deleteCuenta, getCuenta} = require('../controllers/cuenta.controllers');

router.route('/')
    .post(postCuenta)
    .get(getCuentas)
router.route('/idCuenta/:id')
    .get(getCuenta)
    .delete(deleteCuenta)

module.exports = router;