const {Router} = require('express');
const router = Router();

const {id,cargar,modificarVarios,getForNroVentaAndTipoVenta,porRubro, getforNumberAndCliente, putForCodigoAndTipoVenta, setCodigo} = require('../controllers/movProducto.controllers');

router.route('/')
    .get(setCodigo)
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