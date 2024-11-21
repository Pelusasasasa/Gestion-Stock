const {Router} = require('express');
const router = Router();

const { postMovRecibo, getForNumber } = require('../controllers/movRecibos.controllers');

router.route('/')
    .post(postMovRecibo)
router.route('/forNumber/:number')
    .get(getForNumber)

module.exports = router;