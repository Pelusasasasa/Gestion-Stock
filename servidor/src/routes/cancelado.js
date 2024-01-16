const { Router } = require('express');
const router = Router();

const { post, getCanceladosForDay, getUltimo, } = require('../controllers/cancelado.controllers');


router.route('/')
    .post(post);
router.route('/forDay/:desde/:hasta')
    .get(getCanceladosForDay)
router.route('/ultimo')
    .get(getUltimo)

module.exports = router;