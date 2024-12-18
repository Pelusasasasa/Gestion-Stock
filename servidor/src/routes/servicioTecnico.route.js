const {Router} = require('express');
const router = Router();

const { post, getAll, deleteForId, getForId, putForId, getForText } = require('../controllers/servicioTecnico.controllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.route('/')
    .get(getAll)
    .post(
        [
            check('idCliente', 'Se necesita el id del cliente').not().isEmpty(),
            check('numero', "El numero es Obligatorio").not().isEmpty(),
            check('cliente', "El nombre cliente es Obligatorio").not().isEmpty(),
            check('vendedor', "El nombre vendedor es Obligatorio").not().isEmpty(),
            validarCampos
        ],
        post
    )
router.route('/id/:id')
    .get(getForId)
    .put(
        [
            check('idCliente', 'Se necesita el id del cliente').not().isEmpty(),
            check('numero', "El numero es Obligatorio").not().isEmpty(),
            check('cliente', "El nombre cliente es Obligatorio").not().isEmpty(),
            check('vendedor', "El nombre vendedor es Obligatorio").not().isEmpty(),
            validarCampos
        ],
        putForId)
    .delete(deleteForId)
router.route('/forText/:text')
    .get(getForText)


module.exports = router
