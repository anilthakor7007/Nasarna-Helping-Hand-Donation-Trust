const express = require('express');
const { getDonationsForDonors } = require('../controllers/donationController');
const router = express.Router();

router.get('/donor/donations', getDonationsForDonors);

module.exports = router;
