const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    token = process.env.FB_VERIFY_TOKEN,
    access = process.env.FB_ACCESS_TOKEN;

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({enxtended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/webhook/', (req, res) => {
    if(req.query['hub.verify_token'] === token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('No entry');
});

app.post('/webhook', (req, res) => {

    var body = req.body;

    if(body.object == 'page') {

        body.entry.forEach(function(entry) {
            var pageID = entry.ID;
            var timeOfEvnt = entry.time;

            entry.messaging.forEach(event => {
                if(event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });

            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        });

        res.status(200).send('EVENT_RECIEVED');
    } else {
        res.sendStatus(404);
    }

});



app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
});


