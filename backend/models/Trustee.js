const mongoose = require('mongoose');

const trusteeSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    phone: { 
        type: String, 
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    pincode: { 
        type: String, 
        required: true, 
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'] 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Trustee', trusteeSchema);
