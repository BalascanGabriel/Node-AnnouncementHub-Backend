const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const userControllerClass = require('../controllers/usersController')

const userController = new userControllerClass()



router.get('/register', (req, res) => {
    res.render('createuser')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', userController.userLogin);


//Get all users
router.get('/all', userController.getAllUsers)

router.get('/userDetails', userController.getUserDetails)


//Get one user by id
router.get('/:id', getUser, userController.getUserById)


router.post('/new', userController.createNewUser);


//delete user
router.delete('/delete/:id', getUser, userController.deleteUser)

//update user
router.patch('/update/:id', getUser, userController.updateUser)


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