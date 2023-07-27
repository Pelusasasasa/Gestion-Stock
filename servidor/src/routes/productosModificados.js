const {Router} = require('express');
const router = Router();

const {post,getAll,getForDate} = require('../controllers/ProductosModificados.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/forDate/:desde/:hasta')
    .get(getForDate)

module.exports = router;