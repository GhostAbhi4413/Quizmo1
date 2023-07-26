const mongoose = require("mongoose");
const { stringify } = require("querystring");

const quizSchema=new mongoose.Schema({
    // _id:String,
    "name":String,
    "class_id":String,
    "date":String
});

module.exports=mongoose.model("quiz",quizSchema); 