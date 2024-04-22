const {Router} = require('express');
const router = Router();

const {id,cargar,modificarVarios,getForNroVentaAndTipoVenta,porRubro, getforNumberAndCliente, putForCodigoAndTipoVenta} = require('../controllers/movProducto.controllers');

router.route('/')
    .put(modificarVarios)
    .post(cargar)
router.route('/:nro_venta/:tipoVenta')
    .get(getForNroVentaAndTipoVenta)
router.route('/forCodigoAndNumeroVenta/:codigo/:tipoVenta')
    .put(putForCodigoAndTipoVenta)
router.route('/rubro/:rubro/:desde/:hasta')
    .get(porRubro)
router.route('/forNumberAndCliente/:number/:cliente')
    .get(getforNumberAndCliente)
module.exports = router;