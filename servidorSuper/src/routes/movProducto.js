const {Router} = require('express');
const router = Router();

const {id,cargar,modificarVarios,porId,porRubro} = require('../controllers/movProducto.controllers');

router.route('/')
    .put(modificarVarios)
    .post(cargar)
router.route('/:id/:tipoVenta')
    .get(porId)
router.route('/rubro/:rubro/:desde/:hasta')
    .get(porRubro)
module.exports = router;