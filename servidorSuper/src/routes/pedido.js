const {Router} = require('express');

const router = Router();

const { getAll, post } = require('../controllers/pedido.controllers');

router.route('/')
    .get(getAll)
    .post(post)


module.exports = router;