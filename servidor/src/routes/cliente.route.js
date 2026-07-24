const { Router } = require('express');
const router = Router();

const { getsClientes, cargarCliente, id, getClienteId, eliminarCliente, modificarCliente, traerClienteConSaldo, desactivarCliente, activarCliente } = require('../controllers/cliente.controllers');

router.route('/')
    .get(id)
    .post(cargarCliente)

router.route('/buscar/:nombre')
    .get(getsClientes)

router.route('/id/:id')
    .get(getClienteId)
    .delete(eliminarCliente)
    .put(modificarCliente)

router.route('/clientesConSaldo')
    .get(traerClienteConSaldo)

router.route('/desactivar/:id')
    .patch(desactivarCliente)
router.route('/activar/:id')
    .patch(activarCliente)

module.exports = router;