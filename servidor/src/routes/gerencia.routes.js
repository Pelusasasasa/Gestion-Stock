const { Router } = require("express");
const router = Router();
const {
    realizarGerencia,
    obtenerGerencias
} = require("../controllers/gerencia.controller");

router.route('/').post(realizarGerencia);
router.route('/').get(obtenerGerencias)

module.exports = router;