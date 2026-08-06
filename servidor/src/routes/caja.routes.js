const { Router } = require("express");
const {
  traerInformacionCajaDelDia,
  traerInformacionCajaDelMes,
  traerInformacionCajaDelAnio,
} = require("../helpers/obtenerInformacionCaja");
const { desactivar, activar } = require("../controllers/caja.controller");
const router = Router();

router.route("/dia/:desde/:hasta").get(traerInformacionCajaDelDia);
router.route("/mes/:month").get(traerInformacionCajaDelMes);
router.route("/anio/:year").get(traerInformacionCajaDelAnio);

router.route('/desactivar').patch(desactivar)
router.route('/activar').patch(activar)

module.exports = router;
