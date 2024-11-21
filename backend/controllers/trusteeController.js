const Trustee = require('../models/Trustee');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { trusted } = require('mongoose');

// Helper function to generate a secure password using the name
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


exports.createTrustee = async (req, res) => {
    try {
        const { name, email, phone, address, city, pincode, status } = req.body;

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

        const user = new User({ name, email, role: 'trustee', password: hashedPassword });
        await user.save();

        const trustee = new Trustee({ userId: user._id, phone, address, city, pincode, status });
        await trustee.save();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Email configuration is missing in environment variables.");
            return res.status(500).json({ error: "Email configuration error." });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Trustee Account Created Successfully',
            text: `Dear ${name},\n\nYour trustee account has been created successfully.\n\nEmail: ${email}\nPassword: ${userPassword}\n\nPlease save these credentials securely.\n\nBest regards,\nNasarna Child Trust.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error while sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json({
            message: 'Trustee created successfully',
            trustee,
            initialPassword: userPassword,
            confirmationMessage: 'Did you note down the email and password? Please ensure to save them securely.',
            showConfirmation: true,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};


// Get all trustees
exports.getTrustees = async (req, res) => {
    try {
        const trustees = await Trustee.find()
            .populate('userId', 'name email role') 
            .exec();

        res.json(trustees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single trustee by ID
exports.getTrusteeById = async (req, res) => {
    try {
        const { id } = req.params;
        const trustee = await Trustee.findById(id)
            .populate('userId', 'name email role') 
            .exec();

        if (!trustee) {
            return res.status(404).json({ error: 'Trustee not found' });
        }

        res.json(trustee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update trustee details by ID
exports.updateTrustee = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, phone, address, city, pincode, status } = req.body;
        const { name, email } = userId || {}; 

        // Find the Trustee document by ID
        const trustee = await Trustee.findById(id);
        if (!trustee) {
            return res.status(404).json({ error: 'Trustee not found' });
        }

        // Find the associated User document by userId in Trustee
        const user = await User.findById(trustee.userId);
        if (!user) {
            return res.status(404).json({ error: 'User associated with this trustee not found' });
        }

        // Update User-specific fields if provided
        if (name) user.name = name;
        if (email) user.email = email;

        // Save updated User document
        await user.save();

        // Update Trustee-specific fields if provided
        if (phone) trustee.phone = phone;
        if (address) trustee.address = address;
        if (city) trustee.city = city;
        if (pincode) trustee.pincode = pincode;
        if (status) trustee.status = status;

        // Save updated Trustee document
        await trustee.save();

        res.json({
            message: 'Trustee updated successfully',
            trustee,
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleTrusteeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const trustee = await Trustee.findById(id);
        if (!trustee) {
            return res.status(404).json({ error: 'Trustee not found' });
        }

        // Toggle the status
        trustee.status = trustee.status === 'active' ? 'inactive' : 'active';
        await trustee.save();

        res.json({ message: 'Trustee status toggled successfully', trustee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete trustee (set isDeleted flag to true)
exports.deleteTrustee = async (req, res) => {
    try {
        const { id } = req.params;
        const trustee = await Trustee.findById(id);
        if (!trustee) {
            return res.status(404).json({ error: 'Trustee not found' });
        }

        // Set isDeleted flag to true for soft deletion
        trustee.isDeleted = true;
        await trustee.save();

        res.json({ message: 'Trustee deleted successfully', trustee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
