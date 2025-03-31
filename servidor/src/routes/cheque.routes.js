const { Router } = require("express");
const router = Router();

const { postOne, gestAll, patchOne, deleteOne } = require('../controllers/cheque.controllers'); 

router.route('/')
    .get(gestAll)
    .post(postOne)
router.route('forId/:id')
    .patch(patchOne)
    .delete(deleteOne)

module.exports  = router;