const { Router } = require('express');
const router = Router();

const { postOne, getAll, patchOne, deleteOne } = require('../controllers/tarjeta.controllers');

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/forId/:id')
    .patch(patchOne)
    .delete(deleteOne)
module.exports = router;