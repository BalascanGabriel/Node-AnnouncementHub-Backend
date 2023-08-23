const express = require('express')
const router = express.Router()
const Announcement = require('../models/announcement')


//Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find()
        res.json(announcements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get one anncouncement
router.get('/:id', (req, res) => {
    res.send(req.params.id)
})

//Create an announcement
router.post('/', async (req, res) => {
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

    try{
        const newAnnouncement = await announcement.save()
        res.status(201).json(newAnnouncement)
    }
    catch(error){
        res.status(400).json({message : error.message})
    }
})

//Update an announcement
router.patch('/', (res, req) => {

})

//Delete an announcemnt
router.patch('/', (res, req) => {

})

module.exports = router