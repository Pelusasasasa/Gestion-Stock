const { Router } = require('express');
const router = Router();

const {getProvedores, postProvedor, patchProvedor, getProvedor, deleteProvedor, getProvedoresForText} = require('../controllers/provedor.controllers');


router.route('/')
    .get(getProvedores)
    .post(postProvedor)
router.route('/forId/:id')
    .get(getProvedor)
    .patch(patchProvedor)
    .delete(deleteProvedor)
router.route('/forText/:text')
    .get(getProvedoresForText)


module.exports = router;