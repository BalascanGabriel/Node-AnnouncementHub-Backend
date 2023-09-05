const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  announcement: {
    type: Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true,
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
