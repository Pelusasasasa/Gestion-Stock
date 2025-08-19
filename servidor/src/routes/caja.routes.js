const { Router } = require('express');
const { traerInformacionCajaDelDia, traerInformacionCajaDelMes, traerInformacionCajaDelAnio } = require('../helpers/obtenerInformacionCaja');
const router = Router();

router.route('/dia/:fecha')
.get(traerInformacionCajaDelDia)
router.route('/mes/:month')
.get(traerInformacionCajaDelMes)
router.route('/anio/:year')
.get(traerInformacionCajaDelAnio)


module.exports = router;