const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    value: {
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Document', documentSchema);
// to sprawia ze bedziemy mogli uzywac tego modelu w innych plikach