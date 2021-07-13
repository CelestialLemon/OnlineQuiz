require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const AuthRouter = require('./routes/authentication')
const QuizRouter = require('./routes/quiz')

const server = express();

server.use(cors({credentials : true, origin : '*'}))
server.use(bodyParser.urlencoded({extended : false}))
server.use(bodyParser.json());

server.use('/auth', AuthRouter);
server.use('/quiz', QuizRouter);

server.get('/', (req, res) =>
{
    res.json({"msg" : "welcome to our perfectly working server"});
})

server.listen(process.env.PORT, console.log("Server listening at PORT " + process.env.PORT));