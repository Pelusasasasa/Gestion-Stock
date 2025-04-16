const { Router } = require('express');
const { getAll, postOne, patchOne, deleteOne } = require('../controllers/tipoCuenta.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/:id')   
    .delete(deleteOne)
    .patch(patchOne)

module.exports = router;