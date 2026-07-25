const {Router} = require('express');
const router = Router();

const { getAll, post, deleteForId, putForId, getForId, desactivar, activar } = require('../controllers/vendedor.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)
router.route('/desactivar/:id')
    .patch(desactivar)
router.route('/activar/:id')
    .patch(activar)
module.exports = router