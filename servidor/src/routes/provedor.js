const { Router } = require('express');
const router = Router();

const {getProvedores, postProvedor, putProvedor, getProvedor, deleteProvedor, getProvedoresForText} = require('../controllers/provedor.controllers');


router.route('/')
    .get(getProvedores)
    .post(postProvedor)
router.route('/forId/:id')
    .get(getProvedor)
    .put(putProvedor)
    .delete(deleteProvedor)
router.route('/forText/:text')
    .get(getProvedoresForText)


module.exports = router;