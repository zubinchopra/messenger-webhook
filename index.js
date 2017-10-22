const 
    express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({enxtended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/webhook/', (req, res) => {
    if(req.query['hub.verify_token'] === 'SAFEPATH') {
        res.send(req.query['hub.challenge'])
    }
    res.send('No entry');
});

// app.post('/webhook', (req, res) => {

//     let body = req.body;

//     if(body.object == 'page') {

//         body.entry.forEach(function(entry) {
//             let webhookEvent = entry.messaging[0];
//             console.log(webhookEvent);
//         });

//         res.status(200).send('EVENT_RECIEVED');
//     } else {
//         res.sendStatus(404);
//     }

// });



app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
});


