const { Router } = require('express');
const { crearFacturaProvedor } = require('../controllers/facturaProvedor.controller');
const router = Router();

router.route('/').post(crearFacturaProvedor);

module.exports = router;
