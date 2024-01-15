const { Router } = require('express');
const router = Router();

const { post, getCanceladosForDay, } = require('../controllers/cancelado.controllers');


router.route('/')
    .post(post);
router.route('/forDay/:desde/:hasta')
    .get(getCanceladosForDay)

module.exports = router;