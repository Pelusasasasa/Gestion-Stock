const { Router } = require('express');

const router = Router();

const { getAll, post, getForId, putForId, deleteForId, getLast } = require('../controllers/marca.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/forId/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)
router.route('/last')
    .get(getLast)
module.exports = router;