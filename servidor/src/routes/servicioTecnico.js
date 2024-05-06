const {Router} = require('express');
const router = Router();

const { post, getAll, deleteForId, getForId, putForId } = require('../controllers/servicioTecnico.controllers')

router.route('/')
    .get(getAll)
    .post(post)


module.exports = router
