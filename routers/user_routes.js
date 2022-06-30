const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
require('../db/mongoose')
const userModel = require('../models/user_model')   

router.post('/create-user', async (request,response) => {

    const user = new userModel(request.body)
    try{
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
        user.save().then((user) => { response.status(201).send(user) })
    }catch(error){
        response.status(500).send(error)
    }
})

router.post('/user/login', async(request, response) => {

    try{
        const user = await userModel.findByCredentials(request.body.email, request.body.password)
        console.log(user)
        response.status(200).send(user)
    }
    catch(error) {
        response.status(400).send(error)
    }
})

router.get('/getusers', async (request, response) => {

    try{
        const user = await userModel.find({})
        response.send(user)
    }catch(e){
        response.status(404).send(e)
    }
})

router.get('/getoneuser/:name', async (request, response) => {

    const name = request.params.name
    try{
        const user = await userModel.findOne({name})
        if(!user)
        {
            response.status(404).send('User Not found')
        }
        response.send(user)
    }catch(e){
        response.status(500).send(e)
    }
})

router.patch('/updateuser/:name' , async(request, response) => {

    const updates = Object.keys(request.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => {return allowedUpdates.includes(update)})

    if(!isValidOperation) {
        response.status(404).send('Error : Not a valid operation')
    }
    try{
        const user = await userModel.findOne(request.params)
        if(!user) {
            response.status(404).send('User not found')
        }
        updates.forEach((update) => {
            user[update] = request.body[update]
        })
        if(user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        user.save().then((user) => { response.status(200).send(user)})
    }catch(e){
        response.status(400).send(e)
    }
})

router.delete('/deleteuser', async(request, response) => {

    try{
        const user = await userModel.findOneAndDelete(request.body)
        if(!user) {
            response.status(404).send('User not found')
        }
        response.send(user)
    }catch(e){
        response.status(500).send(e)
    }
})


module.exports = router