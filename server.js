const express = require('express');
const app = express();
const PORT = 3102;
const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.use(express.static('./public'));
app.use('/', require('./server/routes/status'));
app.use('/api', require('./server/routes/api'));

app.listen(PORT, () => {
    console.log('server with video streams listening on port ', PORT);
});