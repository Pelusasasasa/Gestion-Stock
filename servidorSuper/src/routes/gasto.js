const {Router} = require('express');
const router = Router();

const {post, getBetweenDates, forDay, forMonth} = require('../controllers/gasto.controllers');

router.route('/')
    .post(post)
router.route('/dia/:fecha')
    .get(forDay)
router.route('/mes/:month')
    .get(forMonth)
router.route('/forDate/:desde/:hasta')
    .get(getBetweenDates)


module.exports = router;
