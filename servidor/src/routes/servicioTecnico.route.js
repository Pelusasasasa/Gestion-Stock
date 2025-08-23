const {Router} = require('express');
const router = Router();

const { getForText, traerActivos, traerPorId, modificarEstado, crearServicio, modificarPorId, eliminarPorID } = require('../controllers/servicioTecnico.controllers');

router.route('/')
    .get(traerActivos)
    .post(crearServicio)
router.route('/:id')
    .delete(eliminarPorID)
    .get(traerPorId)
    .put(modificarPorId)
    .patch(modificarEstado)
router.route('/forText/:text')
    .get(getForText)


module.exports = router
