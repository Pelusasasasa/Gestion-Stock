const { Router } = require("express");

const router = Router();


const {get, post} = require('../controllers/nroSerie.controllers');

router.route('/')
    .get(get)
    .post(post)

module.exports = router;