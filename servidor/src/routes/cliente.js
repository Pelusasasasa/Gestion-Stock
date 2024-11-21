const {Router} = require('express');
const router = Router();

const {getsClientes,cargarCliente,id,getClienteId,eliminarCliente,modificarCliente,traerClienteConSaldo} = require('../controllers/cliente.controllers');

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

module.exports = router;