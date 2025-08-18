const { Router } = require('express');
const { traerInformacionCajaDelDia, traerInformacionCajaDelMes } = require('../helpers/obtenerInformacionCaja');
const router = Router();

router.route('/dia/:fecha')
.get(traerInformacionCajaDelDia)
router.route('/mes/:month')
.get(traerInformacionCajaDelMes)


module.exports = router;