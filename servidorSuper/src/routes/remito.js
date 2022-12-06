const {Router} = require('express');
const router = Router();

const  {post} = require('../controllers/remito.controllers');

router.route('/')
    .post(post)

module.exports =  router