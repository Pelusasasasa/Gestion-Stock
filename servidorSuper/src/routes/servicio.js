const {Router} = require('express');
const router = Router();

const { post, getAll, deleteForId, getForId, putForId } = require('../controllers/servicio.controllers')

router.route('/')
    .get(getAll)
    .post(post)

router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)

module.exports = router
