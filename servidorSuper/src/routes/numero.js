const {Router} = require('express');
const router = Router();

const {traerNumeros,gargarNumeros,modificarNumeros,modificarNumero} = require('../controllers/numero.controllers');

router.route('/')
    .post(gargarNumeros )
    .get(traerNumeros)
    .put(modificarNumeros)
router.route('/:numero')
    .put(modificarNumero)

module.exports = router;