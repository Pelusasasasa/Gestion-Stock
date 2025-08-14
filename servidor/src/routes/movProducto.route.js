const { Router } = require('express');
const router = Router();

const { id, cargar, modificarVarios, porId, porRubro, post, deleteForIdAndTipo } = require('../controllers/movProducto.controllers');

router.route('/')
    .put(modificarVarios)
    .post(cargar)
router.route('/post')
    .post(post)
router.route('/:id/:tipoVenta')
    .get(porId)
    .delete(deleteForIdAndTipo)
router.route('/rubro/:rubro/:desde/:hasta')
    .get(porRubro)
module.exports = router;