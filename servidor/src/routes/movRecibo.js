const { Router } = require('express');
const router = Router();

const {post, getAll} = require('../controllers/movRecibo.controllers');

router.route('/')
    .post(post)
    .get(getAll)


module.exports = router;