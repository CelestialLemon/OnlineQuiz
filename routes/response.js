const express = require('express');
const { mongo } = require('mongoose');
const router = express.Router();

const QuizModel = require('../models/quiz.model')
const UserModel = require('../models/user.model')

const authenticateToken = require('../functions/authenticateToken');

router.get('/myresponses', authenticateToken, async (req, res) =>
{
    console.log('Get request for my responses for user ' + req.user.username + ' at ' + new Date());
    const userData = await UserModel.findOne({username : req.user.username});
    res.json(userData.myResponses);
})

module.exports = router;
