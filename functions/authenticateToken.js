const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const authenticateToken = (req, res, next) =>
{
    if(req.headers && req.headers['authorization'])
    {
        console.log("token found");
        const token = req.headers['authorization'].split(' ')[1];
       
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>
        {
            if(err)
            {
                res.send({"loggedIn" : false, "msg" : "Invalid token"});
                console.log("Invalid token")
                return;
            }
            //res.send({"loggedIn" : true, "msg" : "logged in with token"});
            console.log("logged in with token");
            req.user = user;
            next();
        }
        )
    }
    else
    {
        //token wasn't sent
        next();
    }
}


module.exports = authenticateToken;