const { Router } = require('express');
const { postOne, getAll } = require('../controllers/remito.controllers');

const router = Router();

router.route('/')
.get(getAll)
.post(postOne)

module.exports = router;