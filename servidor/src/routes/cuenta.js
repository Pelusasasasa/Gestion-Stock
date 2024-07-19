const { Router } = require('express');
const router = Router();


const {getCuentas, postCuenta, deleteCuenta} = require('../controllers/cuenta.controllers');

router.route('/')
    .post(postCuenta)
    .get(getCuentas)
router.route('/idCuenta/:id')
    .delete(deleteCuenta)

module.exports = router;