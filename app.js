"use strict";

let http = require('http')

  , express = require('express')
  , app = express()
  , port = process.env.PORT || 3553
  , server = http.createServer(app)
  , path    = require("path")
  , bodyParser = require("body-parser")
  , Twig = require("twig")
  , io = require('socket.io')(server);

let memeArray = ['https://www.wykop.pl/cdn/c3201142/comment_zMIKNCiKnl7y5HZF1bBbHNTZ9RETOjhe.jpg'];
let appSocket;

app.set("twig options", {
    strict_variables: false
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.get('/meme', (req, res) => {
  res.render(path.join(__dirname+'/views/show.twig'), {
    meme: memeArray[0]
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/upload.html'));
});

app.post('/loadmeme',  (req, res) => {
  memeArray.splice(0,0,req.body.meme);
  sendMeme();
  console.dir(req.connection.remoteAddress);
  res.send({ success: true, arr: memeArray });
});

let sendMeme = () => {
  appSocket.emit('meme', memeArray[0])
};

io.on('connection', (socket) => {
  appSocket = socket;
});

server.listen(port, "127.0.0.1" , () => console.log('TMM Working.') );
