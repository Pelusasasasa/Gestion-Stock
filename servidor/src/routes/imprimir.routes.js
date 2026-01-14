const { Router } = require("express");
const { informacionVenta } = require("../controllers/imprimir.controllers");

const router = Router();

router.route("/:id").get(informacionVenta);

module.exports = router;
