'use strict';
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection',function(socket){
   console.log('User is connected to socket.io');
   
   socket.on('message', function(message){
      console.log('Message Received: '+message.text);
      message.timestamp = moment().valueOf();
      //socket.broadcast.emit('message', message); // send message to all sender except sender
      io.emit('message', message); // send message to all users include sender
   });
   
   /*socket.emit('message',{
       text: 'This is my first tweet'
   })*/
});

http.listen(PORT, function(err){
   if(err){
       console.log(err);
   }else{
       console.log('Server running on '+PORT);
   }
});