const jwt = require("jsonwebtoken")
const User = require('../models/user')

const auth = async(req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
            // console.log('token b4 decoded', token)
            //    console.log('Llenght is  ', token.length)
            //    token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTcxZTc5Mjk5MjNlOTE4ZjRiM2ExNzIiLCJpYXQiOjE1ODQ1MjMxNjF9.stT9KigOUenwoILqC9e7BmY_1cbzrAyDcgH1I-_hzrA'

        //  console.log('token 2 lenght', token2.length)
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
            // console.log('decoded string ix ', decoded)

        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })
            //  console.log('user to find out ', user)

        if (!user) {
            throw new Error('user not found')
        }
        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(404).send('Authenticate Yourself !!!')

    }

}

module.exports = auth