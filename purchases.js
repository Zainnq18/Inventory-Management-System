const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');

// Route to fetch all purchases
router.get('/', purchasesController.getPurchases);

// Route to add a new purchase
router.post('/', purchasesController.addPurchase);

module.exports = router;
