const {Router} = require('express');
const router = Router();

const {getsRubros,deleteForId, postRubro, putRubro, getLastNumero, getsRubro} = require('../controllers/rubro.controllers');

router.route('/')
    .get(getsRubros)
    .post(postRubro)
router.route('/last')
    .get(getLastNumero)
router.route('/numero/:numero')
    .get(getsRubro)
    .put(putRubro)
    .delete(deleteForId)
    



module.exports = router;