const {Router} = require('express');
const router = Router();

const {post, getBetweenDates, forDay, forMonth, forYear} = require('../controllers/gasto.controllers');

router.route('/')
    .post(post)
router.route('/dia/:fecha')
    .get(forDay)
router.route('/mes/:month')
    .get(forMonth)
router.route('/anio/:anio')
    .get(forYear)
router.route('/forDate/:desde/:hasta')
    .get(getBetweenDates)


module.exports = router;
