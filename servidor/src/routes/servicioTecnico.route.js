const {Router} = require('express');
const router = Router();

const { getForText, traerActivos, traerPorId, modificarEstado, crearServicio, modificarPorId, eliminarPorID, traerPorNumero } = require('../controllers/servicioTecnico.controllers');

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
router.route('/numero/:numero')
    .get(traerPorNumero)


module.exports = router
