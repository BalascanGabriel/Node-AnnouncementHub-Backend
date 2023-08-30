const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')



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

        console.log(user); // Log the retrieved user

        // Check if the user exists and compare hashed password
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', passwordMatch);
            delete user.password;

            if (passwordMatch) {
                // Successful login
                res.status(200).json({ success: true, message: `Login successful! Welcome back, ${user.name}`, user: {id : user._id ,name: user.name, email: user.email } });
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

router.post('/new', async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of rounds for hashing

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.json({ success: true });
});


// //Create user
// router.post('/new', async (req, res) => {
//     //logging the requested body
//     console.log(req.body)
//     const { name, email, password } = req.body;

//     const newUser = new User({
//         name,
//         email,
//         password
//     });

//     await newUser.save();

//     res.json({ success: true })
// })

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