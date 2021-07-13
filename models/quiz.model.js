const mongoose = require('mongoose');

var QuizSchema = mongoose.Schema(
    {
        creator : {
            type : String,
            required : true
        },

        quizName : {
            type : String,
            required : true
        },

        description : {
            type : String,
            required : false
        },

        timeCreated : {
            type : Date,
            required : false
        },

        questions : {
            type : Array,
            required : false
        },

        responses : {
            type : Array,
            required : false
        }
    }
);

module.exports = mongoose.model("quizModel", QuizSchema);