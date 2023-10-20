const {Router} = require('express');
const router = Router();

const { postMovRecibo } = require('../controllers/movRecibos.controllers');

router.route('/')
    .post(postMovRecibo)

module.exports = router;