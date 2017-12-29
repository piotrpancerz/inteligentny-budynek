const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true },
    type: { type: String, required: true },
    name: { type: String, unique: true, required: true },
    range: { type: Array, required: true },
    resolution: { type: Number, required: true },
    desired: { type: Number, required: true },
    regulation: { type: Boolean, required: true },
    icon: { type: Object, required: true },
    data: { type: Array, required: true }
});

const Component = mongoose.model('components', ComponentSchema);

module.exports = Component;