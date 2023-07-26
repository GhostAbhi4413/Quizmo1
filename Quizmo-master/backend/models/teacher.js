const mongoose = require("mongoose");
const { stringify } = require("querystring");

const teacherSchema=new mongoose.Schema({
    _id:String,
    "name":String,
    "pass":String,
    "class_id":String,
    "email":String
});

module.exports=mongoose.model("teacher",teacherSchema); 