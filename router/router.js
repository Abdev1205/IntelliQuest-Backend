const express = require("express");
const router = express.Router();
const { testApi } = require("../controllers/testingControllers")

// Route for testing the API
router.get('/testing', testApi);

module.exports = router; 
