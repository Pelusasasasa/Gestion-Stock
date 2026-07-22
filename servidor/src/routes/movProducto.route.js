const { Router } = require('express');
const router = Router();

const { id, cargar, modificarVarios, porId, porRubro, post, deleteForIdAndTipo, traerPorProducto, modificar, postManoObra } = require('../controllers/movProducto.controllers');

router.route('/')
    .put(modificarVarios)
    .post(cargar)
router.route('/post')
    .post(post)
router.route('/movimientoManoObra')
    .post(postManoObra)
router.route('/porProducto/:codigo')
    .get(traerPorProducto)
    .patch(modificar)
router.route('/:id/:tipoVenta')
    .get(porId)
    .patch(modificar)
    .delete(deleteForIdAndTipo)
router.route('/rubro/:rubro/:desde/:hasta')
    .get(porRubro)
module.exports = router;