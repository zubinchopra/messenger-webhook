'use strict';

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());

app.set(process.env.PORT || 1337);

app.post('/webhook', (req, res) => {

    let body = req.body;

    if(body.object == 'page') {

        body.entry.forEach(function(entry) {
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        });

        res.status(200).send('EVENT_RECIEVED');
    } else {
        res.sendStatus(404);
    }

});

app.get('/webhook', (req, res) => {

    let VERIFY_TOKEN = "SAFEPATH";

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token) {

        if(mode == 'subscribe' && token == VERIFY_TOKEN) {
            console.log('WEBHOOK_RECEIVED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }

    }

});

app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
});


