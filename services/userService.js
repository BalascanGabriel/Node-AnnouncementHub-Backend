class userService {
    constructor() { }

    async updateUser(userToUpdate) {
        console.log('Requested body', req.body)


        //Update user
        userToUpdate.name = req.body.name
        userToUpdate.password = req.body.password
        userToUpdate.email = req.body.email

        //Save user
        return await userToUpdate.save()
    }

}

module.exports = userService