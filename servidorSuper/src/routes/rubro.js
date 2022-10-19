const {Router} = require('express');
const router = Router();

const {getsRubros, postRubro, putRubro, getLastId} = require('../controllers/rubro.controllers');

router.route('/')
    .get(getsRubros)
    .post(postRubro)
router.route('/:numero')
    .put(putRubro)
router.route('/id')
    .get(getLastId)
module.exports = router;