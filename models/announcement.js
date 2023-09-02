const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date_added: {
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    visible: {
        type: Boolean,
        require: true,
        default: false
    },
   
    ownerDetails: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Announcement', announcementSchema);