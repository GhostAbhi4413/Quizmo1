const mongoose = require("mongoose");
const { stringify } = require("querystring");

const classSchema=new mongoose.Schema({
    _id:String,
    "teacher_id":String,
    "key":String
});

module.exports=mongoose.model("class",classSchema); 