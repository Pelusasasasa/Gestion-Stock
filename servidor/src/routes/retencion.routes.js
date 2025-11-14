const { Router } = require("express");
const { cargarRetencion } = require("../controllers/retencion.controllers");

const router = Router();

router.route('/')
    .post(cargarRetencion);


module.exports = router;