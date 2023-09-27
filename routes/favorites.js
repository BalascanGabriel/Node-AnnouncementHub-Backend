const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Announcement = require('../models/announcement');
const User = require('../models/user'); // Import the User model
const favoritesController = require('../controllers/favoritesController');

// Add an announcement to favorites
router.post('/add', favoritesController.addToFavorites)

// Remove an announcement from favorites
router.delete('/remove', favoritesController.removeFromFavorites);

//Get favorites for a specific user

router.get('/:userId', favoritesController.getOneUsersFavorites);


module.exports = router;
