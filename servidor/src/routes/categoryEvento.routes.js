const { Router } = require('express');

const router = Router();

const { getAll, postOne, deleteOne, patchOne } = require('../controllers/categoryEvento.controllers');

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/:id')
    .delete(deleteOne)
    .patch(patchOne)

module.exports = router;