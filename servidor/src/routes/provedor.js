const {Router} = require('express');
const router = Router();

const {getLastNumero, getProvedores, postProvedor, putProvedor, getProvedor} = require('../controllers/provedor.controllers');

router.route('/')
    .get(getProvedores)
    .post(postProvedor)

router.route('/last')
    .get(getLastNumero);

router.route('/numero/:numero')
    .get(getProvedor)
    .put(putProvedor)
    .delete(putProvedor);



module.exports = router;