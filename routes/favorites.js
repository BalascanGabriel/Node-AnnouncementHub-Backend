const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Announcement = require('../models/announcement');

// Add an announcement to favorites
router.post('/add', async (req, res) => {
    try {
        const { userId, announcementId } = req.body;

        // Check if the announcement and user exist
        const announcement = await Announcement.findById(announcementId);
        const user = await User.findById(userId);

        if (!announcement || !user) {
            return res.status(404).json({ message: 'Announcement or user not found.' });
        }

        // Check if the announcement is already in favorites
        const existingFavorite = await Favorite.findOne({ user: userId, announcement: announcementId });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Announcement is already in favorites.' });
        }

        // Create a new favorite record
        const favorite = new Favorite({ user: userId, announcement: announcementId });
        await favorite.save();

        return res.status(201).json({ message: 'Announcement added to favorites.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove an announcement from favorites
router.delete('/remove', async (req, res) => {
    try {
        const { userId, announcementId } = req.body;

        // Check if the favorite exists
        const favorite = await Favorite.findOne({ user: userId, announcement: announcementId });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found.' });
        }

        // Delete the favorite record
        await favorite.remove();

        return res.status(200).json({ message: 'Announcement removed from favorites.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get favorites for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all favorites for the user
        const favorites = await Favorite.find({ user: userId });

        // Create an array to store announcement details
        const favoriteAnnouncements = [];

        // Fetch announcement details for each favorite
        for (const favorite of favorites) {
            const announcement = await Announcement.findById(favorite.announcement);
            if (announcement) {
                favoriteAnnouncements.push(announcement);
            }
        }

        return res.status(200).json(favoriteAnnouncements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add this route to your Express application
app.get('/favorites', async (req, res) => {
    const userId = req.locals.userId; // Replace with your method of retrieving user ID from localStorage

    try {
        // Fetch the user's favorite announcements
        const favorites = await Favorite.find({ user: userId }).populate('announcement');

        // Extract announcement details from favorites
        const favoriteAnnouncements = favorites.map((favorite) => favorite.announcement);

        res.render('favorites', { favoriteAnnouncements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
