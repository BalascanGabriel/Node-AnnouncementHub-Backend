const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Get all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get one user by id
router.get('/:id', getUser, (req, res) => {

    const user = res.user

    const userInfo = {
        name: user.name,
        password: user.password,
        email: user.email
    }

    res.json(userInfo)
})

//Create user
router.post('/new', async (req, res) => {
    //logging the requested body
    console.log(req.body)

    //Constructing the user
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })

    //saving the user in the db
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//delete user
router.delete('/delete/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({ message: "User deleted !" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update user
router.patch('/update/:id', getUser, async (req, res) => {
    try{
        const userToUpdate = res.user
        console.log('Requested body' , req.body)


        //Update user
        userToUpdate.name = req.body.name
        userToUpdate.password = req.body.password
        userToUpdate.email = req.body.email

        //Save user
        const updatedUser = await userToUpdate.save()
        res.json({message : "User updated ! ", updatedUser})


    }catch(error){
        res.status(500).json({message : error.message});
    }
})


async function getUser(req, res, next) {

    let user

    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: "User does not exist" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.user = user
    next()
}

module.exports = router