const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Announcement = require('../models/announcement')

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
        res.json(announcements)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getAnnouncementById = async (req, res) => {
    try {
        // Fetch the announcement by ID
        const announcement = await Announcement.findById(req.params.id)
            .populate('ownerDetails'); // Populate ownerDetails field with user information

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Render the announcement details page with the announcement and owner information
        res.render('announcement-details', { announcement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAnnouncementOnId = async (req, res) => {
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
}

const createNewAnnouncement = async (req, res) => {
    console.log(req.body);
    const announcement = new Announcement({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        datePosted: Date(),
        category: req.body.category,
        owner: req.body.owner,
        ownerDetails: req.body.ownerDetails
    })

    try {
        const newAnnouncement = await announcement.save()
        res.status(201).json(newAnnouncement)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getAnnouncementsByUserId = async (req, res) => {
    try {
        console.log('USER ID: ', req.params.userId);
        const announcements = await Announcement.find({ 'ownerDetails': new mongoose.Types.ObjectId(req.params.userId) })
        res.json(announcements)
    } catch (err) {
        console.log('err: ', err);
        res.status(500).json({ message: err.message })
    }
}

const getAnnouncementForUserIdPage = async (req, res) => {
    try {
        console.log('USER ID: ', req.params.userId);
        const announcements = await Announcement.find({ 'ownerDetails': new mongoose.Types.ObjectId(req.params.userId) })
        res.render('userAnnouncements', { announcementsPage: announcements });
        // res.json(announcements)
    } catch (err) {
        console.log('err: ', err);
        // res.status(500).json({ message: err.message })
    }
}

const deleteAnnouncement = async (req, res) => {
    try {
        await res.announcement.deleteOne()
        res.json({ message: "Announcement deleted !" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateAnnouncement = async (req, res) => {
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
}

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    getAnnouncementOnId,
    createNewAnnouncement,
    getAnnouncementsByUserId,
    getAnnouncementForUserIdPage,
    deleteAnnouncement,
    updateAnnouncement

}