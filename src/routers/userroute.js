const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../Middleware/auth')
const multer = require('multer')
const {
    welcomeemail,
    goodbyeemail
} = require('../Emails/account')



router.post('/users/signup', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        console.log('email is as folloowes', user.email)
        welcomeemail(user.email, user.name)
        console.log('mail sent')
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e)
        console.log("error occurred ", e)
    }


    // user.save().then(() => {
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    //     console.log("error occurred ", error)
    // })
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        //console.log('in the error generation')
        res.status(400).send("login failed")
    }

})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('logout successfully !!!')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logout from all the  sessions successfully !!')
    } catch (e) {
        res.status(500).send(e)
    }

})


router.get('/users/me', auth, async(req, res) => {
    //const user = await User.find({})
    res.send(req.user)
})

router.get('/users/:id', async(req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)

    }
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

})

const upload = multer({

    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {
        //file.originalname.match(/\.(doc|docx)$/)

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('file must be image'))
        }
        cb(undefined, true)

    }
})

const errorMiddleware = (req, res, next) => {
    throw new Error('from middleware')
}

router.post('/users/me/avatar', auth, upload.single('upload'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    req.user.avatar = buffer
    req.user.save()
    res.status(200).send()

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('content-type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }



})


router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Deleted successfully')
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'email', 'age', 'password']
    const isvalidOperation = updates.every((update) =>
        allowedupdates.includes(update))

    if (!isvalidOperation) {
        return res.status(400).send({
            error: "invalid updates !"
        })
    }

    try {
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)

    }
    // User.updateOne({
    //     name: name
    // }, {
    //     $set: {
    //         password: "123123123"
    //     }
    // }).then((result) => {
    //     res.send(result)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

})

router.delete('/users/me', auth, async(req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }


        await req.user.remove()
        goodbyeemail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)

    }

})


module.exports = router