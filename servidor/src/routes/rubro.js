const {Router} = require('express');
const router = Router();

const {getsRubros,deleteForId, postRubro, putRubro, getLastId} = require('../controllers/rubro.controllers');

router.route('/')
    .get(getsRubros)
    .post(postRubro)
router.route('/:numero')
    .put(putRubro)
router.route('/codigo/:id')
    .delete(deleteForId)
router.route('/id')
    .get(getLastId)


module.exports = router;