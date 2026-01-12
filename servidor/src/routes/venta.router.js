const { Router } = require("express");
const router = Router();

const {
  getForId,
  putForId,
  cargarVenta,
  VentasDia,
  ventasMes,
  ventaAnio,
  deleteForId,
  getForNumberAndType,
  getbetweenDate,
  getPorFactura,
} = require("../controllers/venta.controllers");

router.route("/").post(cargarVenta);
router.route("/id/:id/:tipo").get(getForId).put(putForId).delete(deleteForId);
router.route("/numeroYtipo/:numero/:tipo").get(getForNumberAndType);
router.route("/dia/:fecha").get(VentasDia);
router.route("/mes/:fecha").get(ventasMes);
router.route("/anio/:fecha").get(ventaAnio);
router.route("/porFecha/:desde/:hasta").get(getbetweenDate);
router.route("/porFactura/:factura/:tipo").get(getPorFactura);
module.exports = router;
