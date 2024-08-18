const { Router } = require("express");

const router = Router();


const {get, post, getForSearch} = require('../controllers/nroSerie.controllers');

router.route('/')
    .get(get)
    .post(post)
router.route('/search/:text')
    .get(getForSearch)

module.exports = router;