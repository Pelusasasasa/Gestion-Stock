const {Router} = require('express');
const router = Router();

const { getAll, post, deleteForId, putForId } = require('../controllers/vendedor.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .put(putForId)
    .delete(deleteForId)

module.exports = router