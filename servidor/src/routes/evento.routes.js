const { Router } = require('express');
const { postOne, deleteOne, getForMonth, patchOne } = require('../controllers/evento.controllers');

const router = Router();

router.route('/')
    .post(postOne)
router.route('/:id')
    .delete(deleteOne)
    .patch(patchOne)
router.route('/forMonthAndYear/:month/:year')
    .get(getForMonth)

module.exports = router;