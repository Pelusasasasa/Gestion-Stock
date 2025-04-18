const { Router } = require('express');
const { getAll, postOne, patchOne, deleteOne, getForType, getForText } = require('../controllers/tipoCuenta.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/:id')
    .delete(deleteOne)
    .patch(patchOne)
router.route('/type/:tipo')
    .get(getForType)
router.route('/forText/:text')
    .get(getForText)

module.exports = router;