const express = require('express')
const router = express.Router()
const User = require('../models/user')


router.get('/register', (req, res) => {
    res.render('createuser')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists and the password matches
        if (user && user.password === password) {
            // Successful login
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            // Invalid credentials
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


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
    const { name, email, password } = req.body;

    const newUser = new User({
        name,
        email,
        password
    });

    await newUser.save();

    res.json({ success: true })
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