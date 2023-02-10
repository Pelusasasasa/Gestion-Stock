const {Router} = require('express');
const router = Router();

const {post, getForNumber, getForDay, deleteForId, getForMonth, getForYear} = require('../controllers/presupuesto.controllers');

router.route('/')
    .post(post)
router.route('/forId/:id')
    .delete(deleteForId)
router.route('/forNumber/:number')
    .get(getForNumber)
router.route('/forDay/:day')
    .get(getForDay)
router.route('/forMonth/:month')
    .get(getForMonth)
router.route('/forYear/:year')
    .get(getForYear)

module.exports = router;