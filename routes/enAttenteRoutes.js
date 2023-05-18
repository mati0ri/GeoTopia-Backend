const express = require("express");
const router = express.Router();
const { createEnAttente, getEnAttente, deleteEnAttente } = require("../controllers/enAttenteController");
const validateToken = require("../middleware/tokenValidationHandler");

router.use(validateToken);

router.route('/').post(createEnAttente).get(getEnAttente);
router.route('/:id').delete(deleteEnAttente);

module.exports = router;