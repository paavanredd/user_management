const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error("Unable to login with creds")
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
        throw new Error("Unable to login with creds")
    }
    return user
}

//defining model for user schema
const User = mongoose.model('User', userSchema)

module.exports = User