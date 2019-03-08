const APP_SECRET = '1e7746e0f6846c771e1ed6278a9eb174';
const VALIDATION_TOKEN = 'abc123';
const PAGE_ACCESS_TOKEN = 'EAAIYse2cvK8BAJDPzOFZCOc8vDufExgwOs8ZBN2LILnAEHZCB9wZBPXdz5prIjszGT8UvRhZAFvF3UYV1kIVauvCAuZBeLow2w7f51P5ryZAuSM7R6s7oU68DicYebZAvFoCwYRlZA9chOphnve1FqetMGP2v3Q4cpdYPZBzg1ZCT0dw2nLwArq8C8t';

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function (req, res) { // Đây là path để validate tooken bên app facebook gửi qua
  console.log(req);
  console.log(req.query['hub.verify_token']);
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log('in webhook get.. ok verify');
    res.send(req.query['hub.challenge']);
  }
  console.log('in webhook get.. errr verify');
  res.send('Error, wrong validation token');
});

app.post('/webhook', function (req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  console.log('in webhohok post..');
  console.log(entries);
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function () {
  console.log("Cdawdasdhat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});