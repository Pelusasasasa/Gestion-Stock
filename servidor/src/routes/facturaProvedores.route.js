const { Router } = require('express');
const { crearFacturaProvedor, obtenerFacturasProvedores, eliminarFacturaProvedor } = require('../controllers/facturaProvedor.controller');
const router = Router();

router.route('/').get(obtenerFacturasProvedores).post(crearFacturaProvedor);

router.route('/:id').delete(eliminarFacturaProvedor);

module.exports = router;
