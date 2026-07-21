const { Router } = require('express');
const { getManoDeObras, postManoObra, deleteManoObra } = require('../controllers/manoObra.controller');

const router = Router();

router.get('/', getManoDeObras);
router.post('/', postManoObra);

router.put('/:id', deleteManoObra)

module.exports = router;
