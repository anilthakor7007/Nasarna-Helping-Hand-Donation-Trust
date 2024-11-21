const express = require('express');
const {
    createTrustee,
    getTrustees,
    getTrusteeById,
    updateTrustee,
    toggleTrusteeStatus,
    deleteTrustee,
} = require('../controllers/trusteeController');

const router = express.Router();

router.post('/', createTrustee);
router.get('/', getTrustees);
router.get('/:id', getTrusteeById);
router.put('/:id', updateTrustee);
router.put('/:id/toggle-status', toggleTrusteeStatus);
router.delete('/:id', deleteTrustee); 

module.exports = router;
