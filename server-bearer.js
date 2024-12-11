const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const config = {
    SECRET: 'abc'
}

// use basic HTTP auth to secure the api
app.use(function (req, res, next) {   // 2 - creating server
    // check if it is not login path
    if (req.path === '/login') {
        return next();
    }

    const token = req.query.token || req.headers["x-access-token"];

    // or in Authorization
    // if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    //     return res.status(401).json({message: 'Missing Authorization Header'});
    // }
    // const token = req.headers.authorization.split(' ')[1];
    //

    if (!token) {
        return res.status(401).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.SECRET);
        // get user from database and check using decoded data
        const user = {name: 'Alex', username: decoded.username};
        req.user = user;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
});

app.post('/login', (req, res) => {
    // check req.body for username & password
    const user = {id: 1, name: 'Alex', username: 'user'};

    // Create token
    const token = jwt.sign(user, config.SECRET, {expiresIn: "2h"});

    // save user token
    user.token = token;

    if (user) {
        return res.json(user);
    } else {
        return res.status(400).json({message: 'Username or password is incorrect'})
    }
});

app.get('/', (req, res) => {
    if (req.user) {
        res.send('User is ' + req.user.name);
    }
    //...
});

app.listen(3002, () => {
    console.log(`Server is running on port 3002`);
    console.log(`http://localhost:3002`);
});
