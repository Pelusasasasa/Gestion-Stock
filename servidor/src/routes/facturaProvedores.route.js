const { Router } = require('express');
const { crearFacturaProvedor, obtenerFacturasProvedores } = require('../controllers/facturaProvedor.controller');
const router = Router();

router.route('/').get(obtenerFacturasProvedores).post(crearFacturaProvedor);

module.exports = router;
