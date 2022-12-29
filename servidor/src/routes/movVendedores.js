const {Router} = require('express');

const router = Router();
const {post, getAll, getForNameAndDate} = require('../controllers/movVendedores.controllers')

router.route('/')
    .post(post)
    .get(getAll)
router.route('/:desde/:name')
    .get(getForNameAndDate)
module.exports = router;