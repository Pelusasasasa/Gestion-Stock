const { Router } = require('express');
const { postOne, deleteOne, getForMonth } = require('../controllers/evento.controllers');

const router = Router();

router.route('/')
    .post(postOne)
router.route('/:id')
    .delete(deleteOne)
    .patch()
router.route('/forMonthAndYear/:month/:year')
    .get(getForMonth)

module.exports = router;