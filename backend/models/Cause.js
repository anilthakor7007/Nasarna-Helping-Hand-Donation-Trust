const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    goal: {
        type: Number,
        required: true,
        min: 0,
    },
    raised: {
        type: Number,
        default: 0,
        min: 0,
    },
    donors: [{
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor', 
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    description: {
        type: String,
        required: true,
        trim: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
}, {
    timestamps: true,
});

const Cause = mongoose.model('Cause', causeSchema);

module.exports = Cause;
