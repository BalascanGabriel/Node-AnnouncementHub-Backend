const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Announcement = require('../models/announcement')
const announcementsController = require('../controllers/announcementsController')

router.get('/new', (req, res) => {
    res.render('createannouncement');
});


//Get all announcements
router.get('/all', announcementsController.getAllAnnouncements)

router.get('/:id', announcementsController.getAnnouncementById)

//Get one anncouncement by id
router.get('/:id', getAnnouncement, announcementsController.getAnnouncementOnId)


//Create an announcement
router.post('/new', announcementsController.createNewAnnouncement)

// Get all announcements for user - endpoint
router.get('/by-user-id/:userId', announcementsController.getAnnouncementsByUserId);

// Get all announcements for user - page
router.get('/by-user-id-page/:userId', announcementsController.getAnnouncementForUserIdPage);


//Delete an announcemnt
router.delete('/delete/:id', getAnnouncement, announcementsController.deleteAnnouncement)

//Update an announcement
router.patch('/update/:id', getAnnouncement, announcementsController.updateAnnouncement);


//callback function to get an announcement
// This is an asynchronous function named getAnnouncement that takes three parameters: req, res, and next.
async function getAnnouncement(req, res, next) {
    let announcement; // Declaration of a variable to hold the announcement information.

    try {
        // Inside this try block, an attempt is made to retrieve an announcement with a specific ID.
        announcement = await Announcement.findById(req.params.id); // 'await' is used to wait for the promise to resolve.

        // If the announcement with the given ID is not found (i.e., it's null),
        // a 404 HTTP response is sent back with a JSON object containing an error message.
        if (announcement == null) {
            return res.status(404).json({ message: "Announcement does not exist :(" });
        }

    } catch (error) {
        // If there's an error during the process (such as an exception being thrown),
        // a 500 HTTP response is sent back with a JSON object containing an error message.
        return res.status(500).json({ message: error.message });
    }

    // If everything goes well, the 'announcement' variable holds the retrieved announcement.
    // The retrieved announcement is assigned to 'res.announcement'.
    // This allows other middleware functions or routes to access the announcement data.
    res.announcement = announcement;

    // Finally, the 'next()' function is called to pass control to the next middleware function.
    next();
}


module.exports = router