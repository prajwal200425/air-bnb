// const express = require("express");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);
// const User =  ;

module.exports = mongoose.model("User",userSchema);