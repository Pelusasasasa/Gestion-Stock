const {Router} = require('express');
const router = Router();

const {post, getForNumber, getForDay, deleteForId, getForMonth, realizarPresupuesto, getForYear, getBetweenDate} = require('../controllers/presupuesto.controllers');

router.route('/')
    .post(post)
router.route('/realizarPresupuesto')
    .post(realizarPresupuesto)
router.route('/forId/:id')
    .delete(deleteForId)
router.route('/forNumber/:number')
    .get(getForNumber)
router.route('/dia/:day')
    .get(getForDay)
router.route('/mes/:month')
    .get(getForMonth)
router.route('/anio/:year')
    .get(getForYear)
router.route('/betweenDate/:desde/:hasta')
    .get(getBetweenDate)

module.exports = router;