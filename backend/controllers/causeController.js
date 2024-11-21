const Cause = require('../models/Cause');
const Donor = require('../models/Donor');
const mongoose = require('mongoose');
// Create a new cause
exports.createCause = async (req, res) => {
    const { name, goal, description } = req.body;

    try {
        const newCause = new Cause({ name, goal, description });
        await newCause.save();
        return res.status(201).json(newCause);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating cause', error });
    }
};

// Get all causes with donors
exports.getAllCauses = async (req, res) => {
    try {
        const causes = await Cause.find().populate('donors.donor', 'name email');
        return res.status(200).json(causes);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching causes', error });
    }
};

// Donate to a cause
exports.donateToCause = async (req, res) => {
    const { causeId, donorId, amount } = req.body;

    try {
        const cause = await Cause.findById(causeId);
        if (!cause) {
            return res.status(404).json({ message: 'Cause not found' });
        }

        // Update raised amount and add donor info
        cause.raised += parseFloat(amount);
        cause.donors.push({ donor: donorId, amount });

        await cause.save();
        return res.status(200).json(cause);
    } catch (error) {
        return res.status(500).json({ message: 'Error processing donation', error });
    }
};


exports.updateCause = async (req, res) => {
    const { id } = req.params;
    const { name, goal, description, status } = req.body;

    try {
        const cause = await Cause.findByIdAndUpdate(id, {
            name,
            goal,
            description,
            status,
        }, { new: true }); // Return the updated document

        if (!cause) {
            return res.status(404).json({ message: 'Cause not found' });
        }

        return res.status(200).json(cause);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating cause', error });
    }
};

// Soft Delete Cause
exports.deleteCause = async (req, res) => {
    const { id } = req.params;

    try {
        const cause = await Cause.findByIdAndUpdate(id, { isDelete: true }, { new: true });
        if (!cause) {
            return res.status(404).json({ message: 'Cause not found' });
        }
        return res.status(200).json({ message: 'Cause deleted successfully', cause });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting cause', error });
    }
};


exports.getCauseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the cause by ID and populate donor details if needed
        const cause = await Cause.findById(id).populate('donors.donor', 'name');

        if (!cause) {
            return res.status(404).json({ message: 'Cause not found' });
        }

        res.status(200).json(cause);
    } catch (error) {
        console.error("Error retrieving cause by ID:", error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

exports.updateCauseStatus = async (req, res) => {
    const { id } = req.params; // Cause ID from URL
    const { status } = req.body; // New status from request body

    // Check if the provided status is valid
    const validStatuses = ['active', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Find the cause by ID and update its status
        const updatedCause = await Cause.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedCause) {
            return res.status(404).json({ error: 'Cause not found' });
        }

        res.json(updatedCause); // Send the updated cause as the response
    } catch (error) {
        console.error('Error updating cause status:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Controller function to get all donations by a specific donor
exports.getDonationsByDonor = async (req, res) => {
    const { donorId } = req.params;

    console.log("Received request to fetch donations for donor ID:", donorId);

    try {
        // Convert donorId to ObjectId and fetch causes related to this donor
        const donations = await Cause.find(
            { 'donors.donor': new mongoose.Types.ObjectId(donorId) },
            {
                name: 1,
                description: 1,
                goal: 1,
                raised: 1,
                donors: { $elemMatch: { donor: new mongoose.Types.ObjectId(donorId) } }
            }
        );

        // Calculate the total donation amount for the donor
        const totalDonation = donations.reduce((total, cause) => {
            const donation = cause.donors[0]?.amount || 0;
            return total + donation;
        }, 0);

        // Format response data
        const result = {
            totalDonation,
            causes: donations.map(cause => ({
                causeId: cause._id,
                causeName: cause.name,
                causeDescription: cause.description,
                goal: cause.goal,
                raised: cause.raised,
                donations: cause.donors
            }))
        };

        // Log and send the formatted result
        console.log("Formatted donation result with total donation:", result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching donations for donor:', error);
        res.status(500).json({ message: 'Error fetching donations' });
    }

};

exports.getIndividualDonorData = async (req, res) => {
    const { donorIds } = req.body; // Array of donor IDs from the request body

    // Validate donorIds
    if (!Array.isArray(donorIds) || donorIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: 'Invalid donor IDs' });
    }

    try {
        // Fetch donor details directly from the Donor collection
        const donors = await Donor.find({ _id: { $in: donorIds } }).select('name email');

        // Create a map for quick lookup of donor details by ID
        const donorMap = donors.reduce((acc, donor) => {
            acc[donor._id.toString()] = donor;
            return acc;
        }, {});

        // Fetch all causes where the donors match the provided donor IDs
        const causes = await Cause.find({
            'donors.donor': { $in: donorIds.map(id => new mongoose.Types.ObjectId(id)) },
        });

        // Handle no causes found
        if (!causes || causes.length === 0) {
            return res.status(404).json({ message: 'No causes found for the provided donor IDs' });
        }

        // Organize the data for each donor
        const donorData = donorIds.map(donorId => {
            const donorObjectId = new mongoose.Types.ObjectId(donorId);

            // Extract the donations for this donor
            const donations = causes.reduce((acc, cause) => {
                const donorDetails = cause.donors.find(d => d.donor.equals(donorObjectId));
                if (donorDetails) {
                    acc.push({
                        causeId: cause._id,
                        causeName: cause.name,
                        causeDescription: cause.description,
                        goal: cause.goal,
                        raised: cause.raised,
                        donatedAmount: donorDetails.amount,
                    });
                }
                return acc;
            }, []);

            const totalDonation = donations.reduce((total, donation) => total + donation.donatedAmount, 0);

            // Get donor details from the donorMap
            const donor = donorMap[donorId] || { name: 'Unknown', email: 'Unknown' };

            return {
                donorId,
                donorName: donor.name,
                donorEmail: donor.email,
                totalDonation,
                donations,
            };
        });

        res.status(200).json(donorData); // Send the result to the frontend
    } catch (error) {
        console.error('Error fetching individual donor data:', error.message || error);
        res.status(500).json({ message: 'Error fetching individual donor data', error: error.message });
    }
};