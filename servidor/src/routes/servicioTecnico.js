const {Router} = require('express');
const router = Router();

const { post, getAll, deleteForId, getForId, putForId, getForText } = require('../controllers/servicioTecnico.controllers')

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
router.route('/forText/:text')
    .get(getForText)


module.exports = router
