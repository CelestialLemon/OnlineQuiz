const express = require('express');
const { mongo } = require('mongoose');
const router = express.Router();

const QuizModel = require('../models/quiz.model')
const UserModel = require('../models/user.model')

const authenticateToken = require('../functions/authenticateToken');

router.post('/add', authenticateToken, async (req, res) =>
{
    const newQuiz = QuizModel(
        {
            "creator" : req.user.username,
            "timeCreated" : Date.now(),
            "quizName" : req.body.quizName,
            "description" : req.body.description,
            "questions" : req.body.questions
        }
    )

    try
        {
            const newSavedQuiz = await newQuiz.save();
            console.log(newSavedQuiz);
            res.status(201).send({
                "msg" : "New Quiz created",
                "_id" : newSavedQuiz._id
            });
        }catch(err)
        {
            console.log(err);
            res.send(err);
        }
})

router.get('/myquizes', authenticateToken, async (req, res) =>
{
    console.log('Get my lists request at ' + new Date());
    const myQuizes = await QuizModel.find({creator : req.user.username});
    res.send(myQuizes);
})

router.get('/attempt/:id', authenticateToken, async (req, res) =>
{
    console.log('Get /' + req.params.id + ' quiz attempt request at ' + new Date());
    const quizData = await QuizModel.findById(req.params.id);
    res.send(quizData);
})

router.post('/submit/:id', authenticateToken, async (req, res) =>
{
    try
    {
        console.log('submit ' + req.params.id + ' request at ' + new Date());
        const quizData = await QuizModel.findById(req.params.id);
        quizData.responses.push({
            "respondent" : req.user.username,
            "answers" : req.body.answers,
            "timeSubmitted" : new Date()
        })
        const updatedQuizData = await QuizModel.findByIdAndUpdate(req.params.id, quizData);

        const userData = await UserModel.findOne({username : req.user.username});
        console.log(userData);
        userData.myResponses.push(
            {
                'creator' : req.body.creator,
                'quizName' : req.body.quizName,
                'timeSubmitted' : new Date() 
            });

        const updatedUser = await UserModel.findByIdAndUpdate(userData._id, userData);
    }catch(err)
    {
        res.send({"msg" : err});
        return;
    }
    res.send({"msg" : "Submitted Successfully"});
})

router.get('/alreadyattempted/:id', authenticateToken, async (req, res) =>
{
    console.log("Request for checking if already attempted quiz at " + new Date());
    const quizData = await QuizModel.findById(req.params.id);
    let alreadyAttempted = false;
    quizData.responses.forEach((response, index) =>
    {
        if(response.respondent == req.user.username)
        {
            alreadyAttempted = true;
        }
    })

    if(alreadyAttempted == true)
    res.send({"msg" : "Already Attempted"})
    if(alreadyAttempted == false)
    res.send({"msg" : "Not Attempted"})
})

router.delete('/:id', authenticateToken, async (req, res) =>
{
    console.log('delete req for quiz ' + req.params.id + ' at ' + new Date());
    const deletedQuiz = await QuizModel.findByIdAndDelete(req.params.id);
    console.log(deletedQuiz);
    res.send({"msg" : "Deleted Successfully"});
})



module.exports = router;