const mongoose = require("mongoose");
const { stringify } = require("querystring");

const studSchema=new mongoose.Schema({
    _id:String,
    "name":String,
    "pass":String,
    "class_id":String,
    "email":String
});

module.exports=mongoose.model("student",studSchema); 