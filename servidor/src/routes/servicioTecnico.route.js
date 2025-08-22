const {Router} = require('express');
const router = Router();

const { getForText, traerActivos, EliminarPorID, traerPorId, modificarEstado } = require('../controllers/servicioTecnico.controllers');
const { cargarEquipos, modificarEquipos } = require('../helpers/cargarEquipos');

router.route('/')
    .get(traerActivos)
    .post(cargarEquipos)
router.route('/id/:id')
    .delete(EliminarPorID)
    .get(traerPorId)
    .put(modificarEquipos)
    .patch(modificarEstado)
router.route('/forText/:text')
    .get(getForText)


module.exports = router
