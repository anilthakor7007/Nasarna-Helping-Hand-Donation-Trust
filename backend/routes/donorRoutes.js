const express = require('express');
const mongoose = require('mongoose');
const { createDonor, getDonorById, updateDonor, deleteDonor, getDonors, toggleDonorStatus, getDonorCountsForTrustees

 } = require('../controllers/donorController');


const router = express.Router();

router.post('/', createDonor); 
router.get('/', getDonors);
router.get('/:id', getDonorById);
router.put('/:id', updateDonor); 
router.put('/:id/toggle-status', toggleDonorStatus); 
router.delete('/:id', deleteDonor); 
router.post('/donor-counts/', getDonorCountsForTrustees);



module.exports = router;
