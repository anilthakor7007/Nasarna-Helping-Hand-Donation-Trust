const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        console.log(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate JWT token with user ID and role
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.jwt_secret);

            // Exclude password from the user object before sending response
            const { password, ...userData } = user.toObject();

            // Send token and user data (without password) in the response
            res.json({ token, user: userData });
            console.log("Login successful: User ID: ", user._id);
        } else {
            // Invalid credentials, return 401
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        // Catch any error and send 500 response
        res.status(500).json({ error: error.message });
    }
};
