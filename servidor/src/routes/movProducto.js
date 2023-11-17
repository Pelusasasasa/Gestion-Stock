const {Router} = require('express');
const router = Router();

const {id,cargar,modificarVarios,porId,porRubro, getforNumberAndCliente, putForId, putForIdAndTipoVenta} = require('../controllers/movProducto.controllers');

router.route('/')
    .put(modificarVarios)
    .post(cargar)
router.route('/:id/:tipoVenta')
    .get(porId)
    .put(putForIdAndTipoVenta)
router.route('/rubro/:rubro/:desde/:hasta')
    .get(porRubro)
router.route('/forNumberAndCliente/:number/:cliente')
    .get(getforNumberAndCliente)
module.exports = router;