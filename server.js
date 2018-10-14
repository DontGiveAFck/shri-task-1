const express = require('express');
const app = express();
const PORT = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// to prevent CORS error
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('./public'));

//routes require
app.use('/', require('./server/routes/status'));
app.use('/api', require('./server/routes/api'));

app.use(function(req, res, ){
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(PORT, () => {
    console.log('server listening on port ', PORT);
});