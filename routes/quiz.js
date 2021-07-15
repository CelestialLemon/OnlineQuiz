const express = require('express');
const { mongo } = require('mongoose');
const router = express.Router();

const QuizModel = require('../models/quiz.model')

const authenticateToken = require('../functions/authenticateToken');
const quizModel = require('../models/quiz.model');

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