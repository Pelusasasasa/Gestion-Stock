const { Router } = require('express');
const { getAll, postOne, patchOne, deleteOne } = require('../controllers/valor.controllers');
const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/forId/:id')
    .delete(deleteOne)
    .patch(patchOne)

module.exports = router;