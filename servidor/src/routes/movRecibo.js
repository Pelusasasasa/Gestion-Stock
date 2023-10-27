const { Router } = require('express');
const router = Router();

const {post, getAll, getforNumberAndClient} = require('../controllers/movRecibo.controllers');

router.route('/')
    .post(post)
    .get(getAll)
router.route('/forNumberAndClient/:numero/:codigo')
    .get(getforNumberAndClient)


module.exports = router;