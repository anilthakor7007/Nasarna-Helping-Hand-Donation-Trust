const Donor = require('../models/Donor');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

function generateSecurePassword(name) {

    if (!name) {
        console.error("Name is not provided or is empty.");
        return;
    }


    const specialChars = '@$!%*?&';
    const numbers = '0123456789';

    // Capitalize the first letter of the name
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    console.log("Formatted name:", formattedName);

    // Add special characters and numbers after the username
    const randomSpecialChars = specialChars[Math.floor(Math.random() * specialChars.length)] + specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomNumbers = numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)];

    // Combine them to form the password
    const password = formattedName + randomSpecialChars + randomNumbers;
    console.log("Generated password:", password);

    return password;
}


// Create a new donor
exports.createDonor = async (req, res) => {
    try {

        const { name, email, phone, address, city, pincode, status, gender, password, createdBy } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required." });
        }

        console.log("Request Body:", req.body);
        const userPassword = generateSecurePassword(name.split(" ")[0]);

        if (!userPassword) {
            return res.status(400).json({ error: "Failed to generate password. Please check the input." });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = new User({ name, email, role: 'donor', password: hashedPassword });
        await user.save();
        const donor = new Donor({
            userId: user._id,
            phone,
            address,
            city,
            createdBy,
            pincode,
            status,
            gender,
        });
        await donor.save();



        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Donor Account Created Successfully',
            text: `Dear ${name},\n\nYour Donor account has been created successfully.\n\nEmail: ${email}\nPassword: ${userPassword}\n\nPlease save these credentials securely.\n\nBest regards,\nNasarna Child Trust.`,
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error while sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.status(201).json({
            message: 'Donor created successfully',
            donor,
            initialPassword: password ? undefined : userPassword,
            confirmationMessage: 'Did you note down the email and password? Please ensure to save them securely.',
            showConfirmation: true,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

// Get all donors
exports.getDonors = async (req, res) => {
    try {
        const donors = await Donor.find()
            .populate('userId', 'name email role')
            .exec();

        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single donor by ID
exports.getDonorById = async (req, res) => {
    try {
        const { id } = req.params;
        const donor = await Donor.findById(id)
            .populate('userId', 'name email role')
            .exec();

        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        res.json(donor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update donor details by ID
exports.updateDonor = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, phone, address, city, pincode, status, gender } = req.body;
        const { name, email } = userId || {}; // Destructure name and email from userId if present

        // Find the Donor document by ID
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        // Find the associated User document by userId in Donor
        const user = await User.findById(donor.userId);
        if (!user) {
            return res.status(404).json({ error: 'User associated with this donor not found' });
        }

        // Update User-specific fields if provided
        if (name) user.name = name;
        if (email) user.email = email;

        // Save updated User document
        await user.save();

        // Update Donor-specific fields if provided
        if (phone) donor.phone = phone;
        if (address) donor.address = address;
        if (city) donor.city = city;
        if (pincode) donor.pincode = pincode;
        if (status) donor.status = status;
        if (gender) donor.gender = gender;

        // Save updated Donor document
        await donor.save();

        res.json({
            message: 'Donor updated successfully',
            donor,
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle status (active/inactive)
exports.toggleDonorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        donor.status = donor.status === 'active' ? 'inactive' : 'active';
        await donor.save();

        res.json({ message: 'Donor status toggled successfully', donor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete donor (set isDeleted flag to true)
exports.deleteDonor = async (req, res) => {
    try {
        const { id } = req.params;
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        donor.isDeleted = true;
        await donor.save();

        res.json({ message: 'Donor deleted successfully', donor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDonorCountsForTrustees = async (req, res) => {
    try {
        const { trusteeIds } = req.body;

        // Check if trusteeIds is provided and is an array
        if (!Array.isArray(trusteeIds)) {
            return res.status(400).json({ message: "trusteeIds should be an array of IDs" });
        }

        // Convert each trustee ID to an ObjectId
        const objectIdTrusteeIds = trusteeIds.map(id => new mongoose.Types.ObjectId(id));

        const donorCounts = await mongoose.model('User').aggregate([
            {
                $match: { _id: { $in: objectIdTrusteeIds } }
            },
            {
                $lookup: {
                    from: 'donors', // collection name for donors
                    localField: '_id',
                    foreignField: 'createdBy',
                    as: 'donors'
                }
            },
            {
                $project: {
                    _id: 1,
                    trusteeName: "$name", // assuming 'name' is the trustee’s name field
                    donorCount: { $size: "$donors" } // counts donors for each trustee
                }
            }
        ]);

        res.status(200).json(donorCounts);
    } catch (error) {
        console.error("Error fetching donor counts for trustees:", error);
        res.status(500).json({ message: "Error fetching donor counts for trustees", error: error.message });
    }
};