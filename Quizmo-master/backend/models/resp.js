const mongoose = require("mongoose");
const { stringify } = require("querystring");

const respSchema=new mongoose.Schema({
    "stud_id":String,
    "quiz_id":String,
    "ques_id":String,
    "sel_opt_seq":Array,
    "time_stamps":Array,
});

module.exports=mongoose.model("resp",respSchema); 