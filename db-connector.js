const mongoose = require('mongoose');
mongoose.connect('mongodb://test:testtest@ds127801.mlab.com:27801/s9test');

module.exports = mongoose.connection;