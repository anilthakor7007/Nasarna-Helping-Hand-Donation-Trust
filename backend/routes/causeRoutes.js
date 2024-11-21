const express = require('express');
const router = express.Router();
const {
    createCause,
    getAllCauses,
    donateToCause,
    updateCause,
    deleteCause,
    getCauseById,
    updateCauseStatus,
    getDonationsByDonor,
    getIndividualDonorData

} = require('../controllers/causeController'); 


router.post('/donate',donateToCause);
router.post('/', createCause);
router.get('/', getAllCauses);
router.put('/:id', updateCause);
router.delete('/:id', deleteCause);
router.get('/:id', getCauseById);
router.put('/:id/status', updateCauseStatus);
router.get('/:donorId/donations', getDonationsByDonor);
router.post('/donors/data', getIndividualDonorData);



module.exports = router;
