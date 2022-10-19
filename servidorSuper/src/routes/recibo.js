const {Router} = require('express');
const router = Router();

const {cargarRecibo,recibosDia,recibosMes, recibosAnio}= require('../controllers/recibo.controllers');


router.route('/')
    .post(cargarRecibo)
router.route('/dia/:fecha')
    .get(recibosDia)
router.route('/mes/:fecha')
    .get(recibosMes)
router.route('/anio/:fecha')
    .get(recibosAnio)

module.exports = router;