const { Router } = require("express");

const router = Router();


const {get, post, getForSearch, getForDelete} = require('../controllers/nroSerie.controllers');

router.route('/')
    .get(get)
    .post(post)
router.route('/search/:text')
    .get(getForSearch)
router.route('/id/:id')
    .delete(getForDelete)

module.exports = router;