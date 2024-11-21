const {Router} = require('express');
const router = Router();


const {getForId,putForId,cargarVenta,VentasDia,ventasMes,ventaAnio, deleteForId, getForNumberAndType, getbetweenDate} = require('../controllers/venta.controllers');

router.route('/')
    .post(cargarVenta)
router.route('/id/:id/:tipo')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)
router.route('/numeroYtipo/:numero/:tipo')
    .get(getForNumberAndType)
router.route('/dia/:fecha')
    .get(VentasDia)
router.route('/mes/:fecha')
    .get(ventasMes)
router.route('/anio/:fecha')
    .get(ventaAnio)
router.route('/porFecha/:desde/:hasta')
    .get(getbetweenDate)
module.exports = router;