const { Router } = require("express");
const {
  postOne,
  patchOne,
  deleteOne,
  getForDates,
} = require("../controllers/movCaja.controllers");

const router = Router();

router.route("/").post(postOne);
router.route("/:id").delete(deleteOne).patch(patchOne);

router.route("/forDate/:desde/:tipo").get(getForDates);

module.exports = router;
