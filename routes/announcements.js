const express = require('express')
const router = express.Router()
const Announcement = require('../models/announcement')


//Get all announcements
router.get('/all', async (req, res) => {
    try {
        const announcements = await Announcement.find()
        res.json(announcements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get one anncouncement by id
router.get('/:id', getAnnouncement, (req, res) => {
    const announcement = res.announcement

    const announcementInfo = {
        title: announcement.title,
        description: announcement.description,
        date: announcement.Date,
        price: announcement.price,
        location: announcement.location,
        category: announcement.category
    }

    res.json(announcementInfo)
})

//Create an announcement
router.post('/new', async (req, res) => {
    console.log(req.body);
    const announcement = new Announcement({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        datePosted: Date(),
        category: req.body.category,
        owner: req.body.owner
    })

    try {
        const newAnnouncement = await announcement.save()
        res.status(201).json(newAnnouncement)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete an announcemnt
router.delete('/delete/:id', getAnnouncement, async (req, res) => {
    try {
        await res.announcement.deleteOne()
        res.json({ message: "Announcement deleted !" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update an announcement
router.patch('/update/:id', getAnnouncement, async (req, res) => {
    try {
        const announcementToUpdate = res.announcement;

        console.log('Request Body:', req.body); // Log the request body
        console.log('Before Update:', announcementToUpdate);


        // Update the announcement's properties based on the request body
        announcementToUpdate.title = req.body.title || announcementToUpdate.title;
        announcementToUpdate.description = req.body.description || announcementToUpdate.description;
        announcementToUpdate.price = req.body.price || announcementToUpdate.price;
        announcementToUpdate.location = req.body.location || announcementToUpdate.location;
        announcementToUpdate.category = req.body.category || announcementToUpdate.category;


        // Save the updated announcement
        const updatedAnnouncement = await announcementToUpdate.save();
        console.log('After Update:', updatedAnnouncement);

        res.json({ message: "Announcement updated!", updatedAnnouncement });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});


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