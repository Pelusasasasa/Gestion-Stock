const {Router} = require('express');
const router = Router();

const {cargarRecibo,recibosDia,recibosMes, recibosAnio, getForNumber, deleteForNumber, getRecibosPorFecha}= require('../controllers/recibo.controllers');


router.route('/')
    .post(cargarRecibo)
router.route('/id/:number')
    .get(getForNumber)
    .delete(deleteForNumber)
router.route('/dia/:fecha')
    .get(recibosDia)
router.route('/mes/:fecha')
    .get(recibosMes)
router.route('/anio/:fecha')
    .get(recibosAnio)
router.route('/porFecha/:desde/:hasta')
    .get(getRecibosPorFecha)

module.exports = router;