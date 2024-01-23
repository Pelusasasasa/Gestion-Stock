const { Router } = require('express');
const router = Router();

const { post, getCanceladosForDay, getUltimo, getForNumber, deleteForId, } = require('../controllers/cancelado.controllers');


router.route('/')
    .post(post);
router.route('/forDay/:desde/:hasta')
    .get(getCanceladosForDay)
router.route('/ultimo')
    .get(getUltimo)
router.route('/forNumber/:numero')
    .get(getForNumber)
router.route('/forId/:id')
    .delete(deleteForId)

module.exports = router;