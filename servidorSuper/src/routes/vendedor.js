const {Router} = require('express');
const router = Router();

const {post, get, getAll, getForId, putForId, deleteForId} = require('../controllers/vendedor.controllers');


router.route('/')
    .post(post)
    .get(getAll)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)


module.exports = router;