const { Router } = require('express');
const { postOne, getAll, getforid } = require('../controllers/remito.controllers');

const router = Router();

router.route('/')
    .get(getAll)
    .post(postOne)
router.route('/forId/:id')
    .get(getforid)

module.exports = router;