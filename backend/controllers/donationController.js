const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Cause = require('../models/Cause');

exports.getDonationsForDonors = async (req, res) => {
    const { donorIds } = req.body; // Expect an array of donor IDs in the request body

    // Validate input
    if (!donorIds || !Array.isArray(donorIds) || donorIds.length === 0) {
        return res.status(400).json({ message: 'Donor IDs are required and should be an array.' });
    }

    // Validate and convert donor IDs to ObjectId
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!donorIds.every(isValidObjectId)) {
        return res.status(400).json({ message: 'Invalid donor IDs provided.' });
    }

    try {
        // Fetch donations for the provided donor IDs
        const donations = await Donation.aggregate([
            {
                $match: { donor: { $in: donorIds.map(id => new mongoose.Types.ObjectId(id)) } }
            },
            {
                $lookup: {
                    from: 'donors', // Reference to the Donor collection
                    localField: 'donor',
                    foreignField: '_id',
                    as: 'donorDetails'
                }
            },
            {
                $lookup: {
                    from: 'causes', // Reference to the Cause collection
                    localField: 'cause',
                    foreignField: '_id',
                    as: 'causeDetails'
                }
            },
            {
                $unwind: '$donorDetails'
            },
            {
                $unwind: '$causeDetails'
            },
            {
                $group: {
                    _id: '$donor',
                    donorName: { $first: '$donorDetails.name' },
                    donorEmail: { $first: '$donorDetails.email' },
                    totalDonation: { $sum: '$amount' },
                    causes: {
                        $push: {
                            causeId: '$causeDetails._id',
                            causeName: '$causeDetails.name',
                            causeDescription: '$causeDetails.description',
                            donatedAmount: '$amount',
                            donatedAt: '$createdAt',
                            goal: '$causeDetails.goal',
                            raised: '$causeDetails.raised'
                        }
                    }
                }
            }
        ]);

        // If no donations found, return a proper message
        if (donations.length === 0) {
            return res.status(404).json({ message: 'No donations found for the provided donor IDs.' });
        }

        // Respond with the grouped donation data
        res.status(200).json(donations.map(donation => ({
            donorId: donation._id,
            donorName: donation.donorName,
            donorEmail: donation.donorEmail,
            totalDonation: donation.totalDonation,
            causes: donation.causes
        })));
    } catch (error) {
        console.error('Error fetching donations for donors:', error);
        res.status(500).json({ message: 'An error occurred while fetching donation data.' });
    }
};
