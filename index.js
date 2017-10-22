const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    request = require('request'),
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

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
    
    // Parse the request body from the POST
    let body = req.body;
    
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
    
        body.entry.forEach(function(entry) {
    
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
    
    
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender ID: ' + sender_psid);
    
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);        
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
          
        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
    
});

function handleMessage(sender_psid, received_message) {
    let response;

    response = {
        "text": ``
    }
    
    // Checks if the message contains text
    if (received_message.text) {    
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        
        var messageText = received_message.text;
        var responseText = "";

        if(messageText.includes("hey" || "hi")) {
            responseText = "Hey there! How can I help you?"
        }
        else if(!messageText.includes("to home") || !messageText.includes("go home")){
            response.text = "Here are the directions";
        }
        else {
            responseText = "Sure! Give me the address";
        }
        response.text = responseText;
    }

    // Send the response message
    callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
    console.log('ok')
     let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": access },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
}



app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
});


