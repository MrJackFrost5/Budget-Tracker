const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true},
    password: { type: String, required: true },
    email: { type: String, required: true },
    creation_date: { type: Date, required: true },
    last_logged_in: { type: Date, required: true },
    has_access: { type: Boolean, required: true }, 
    credit_score: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;