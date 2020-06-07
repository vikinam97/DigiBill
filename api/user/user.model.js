'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    requestId: String,
    phone: Number
});

module.exports = mongoose.model('User', UserSchema);
