const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    name: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true
    }
});