const mongoose = require('mongoose')
const validator = require('validator')

//defining user schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        default : 0,
        validate : (value) => {
            if(value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    email : {
        type : String,
        trim : true,      
        required : true,
        lowercase : true,
        validate : (value) => {
            if(!validator.isEmail(value)) {
                throw new Error('Email must be of valid type/format')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 7,
        validate : (value) => {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Input password cannot contain "password"')
            }
        }
    }
})

//defining model for user schema
const User = mongoose.model('User', userSchema)

module.exports = User