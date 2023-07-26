const mongoose = require("mongoose");

const quizBankSchema=new mongoose.Schema({
    _id:String,
    "quizId":String,
    "type":String,
    "topic":String,
    "tTime":Number,
    "difficulty":Number,
    "question":String,
    "options":Array,
    "correct":Array,
    "points":Number
});

module.exports=mongoose.model("quizBank",quizBankSchema); 