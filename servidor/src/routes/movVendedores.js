const {Router} = require('express');

const router = Router();
const {post, getAll} = require('../controllers/movVendedores.controllers')

router.route('/')
    .post(post)
    .get(getAll)

module.exports = router;