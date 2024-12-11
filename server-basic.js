const express = require('express');

const app = express();

// use basic HTTP auth to secure the api
app.use(function (req, res, next) {   // 2 - creating server
                                      // check if it is not login path
    if (req.path === '/login') {
        return next();
    }

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.header('WWW-Authenticate', 'Basic'); // Bearer
        return res.status(401).json({message: 'Missing Authorization Header'});
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // get user from database and check
    const user = {name: 'Alex', username: username};
    if (!user) {
        return res.status(401).json({message: 'Invalid Authentication Credentials'});
    }
    // attach user to request object
    req.user = user;

    next();
});

app.post('/login', (req, res) => {
    // check req.body for username & password
    const user = {name: 'Alex', username: 'user'};

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

app.listen(3003, () => {
    console.log(`Server is running on port 3003`);
    console.log(`http://localhost:3003`);
});
