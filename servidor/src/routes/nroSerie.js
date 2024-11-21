const { Router } = require("express");

const router = Router();


const {get, post, getForSearch, getForDelete, putforId} = require('../controllers/nroSerie.controllers');

router.route('/')
    .get(get)
    .post(post)
router.route('/search/:text')
    .get(getForSearch)
router.route('/id/:id')
    .put(putforId)
    .delete(getForDelete)

module.exports = router;