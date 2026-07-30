const { Router } = require('express');

const router = Router();

const { getDatos } = require('../controllers/datos.controller');

router.route('/')
    .get(getDatos)

module.exports = router;