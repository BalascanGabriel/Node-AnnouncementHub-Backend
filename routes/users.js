const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get one user by id
router.get('/:id', getUser ,(req, res) => {

    const user = res.user

    const userInfo = {
        name : user.name,
        password : user.password,
        email : user.email
    }

    res.json(userInfo)
})


async function getUser(req, res, next){

    let user

    try{
        user = await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({message : "User does not exist"})
        }

    } catch(error){
        res.status(500).json({message : error.message})
    }

    res.user = user
    next()
}

module.exports = router