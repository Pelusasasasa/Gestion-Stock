const {Router} = require('express');

const router = Router();
const {post} = require('../controllers/movVendedores.controllers')

router.route('/')
    .post(post)

module.exports = router;