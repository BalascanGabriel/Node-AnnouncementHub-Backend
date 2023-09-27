const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        console.log(user); // Log the retrieved user

        // Check if the user exists and compare hashed password
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', passwordMatch);
            delete user.password;

            if (passwordMatch) {
                // Successful login
                res.status(200).json({ success: true, message: `Login successful! Welcome back, ${user.name}`, user: { id: user._id, name: user.name, email: user.email } });
            } else {
                // Invalid credentials
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } else {
            // User not found
            res.status(401).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUserDetails = async (req, res) => {
    try {
        const userId = req.query.id; // Get the user ID from the query parameter

        // Fetch user details based on the user ID
        const user = await User.findById(userId);

        // Render the userDetails.ejs template and pass the user details to it
        res.render('userDetails', { user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
}

const getUserById = async (req, res) => {
    const user = res.user

    const userInfo = {
        name: user.name,
        password: user.password,
        email: user.email
    }

    res.json(userInfo)
}

const createNewUser = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of rounds for hashing

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.json({ success: true });
}

const deleteUser = async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({ message: "User deleted !" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const userToUpdate = res.user
        console.log('Requested body', req.body)


        //Update user
        userToUpdate.name = req.body.name
        userToUpdate.password = req.body.password
        userToUpdate.email = req.body.email

        //Save user
        const updatedUser = await userToUpdate.save()
        res.json({ message: "User updated ! ", updatedUser })


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    userLogin,
    getAllUsers,
    getUserDetails,
    getUserById,
    createNewUser,
    deleteUser,
    updateUser
}