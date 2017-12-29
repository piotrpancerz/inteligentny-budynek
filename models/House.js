const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true },
});

const House = mongoose.model('houses', HouseSchema);

module.exports = House;