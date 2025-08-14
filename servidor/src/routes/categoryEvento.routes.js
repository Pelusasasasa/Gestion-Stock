const { Router } = require('express');

const router = Router();

const { getAll, postOne, deleteOne, patchOne, getOneForName } = require('../controllers/categoryEvento.controllers');

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/:id')
    .delete(deleteOne)
    .patch(patchOne)
router.route('/forName/:nombre')
    .get(getOneForName)

module.exports = router;