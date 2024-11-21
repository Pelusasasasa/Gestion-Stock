const {Router} = require('express');

const router = Router();

const { getAll, post, deleteForId, putForId, getForId } = require('../controllers/pedido.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)


module.exports = router;