'use strict';
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users
function sendCurrentUsers(socket){
    var info = clientInfo[socket.id];
    var users = [];
    if(typeof info === 'undefined'){
        return;
    }
    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo = clientInfo[socketId];
        if(info.room === userInfo.room){
            users.push(userInfo.name);
        }
    });
    
    socket.emit('message',{
       name: 'System',
       text: 'Current users:' + users.join(', '),
       timestamp: moment.valueOf() 
    });
}

// Server Chat connection
io.on('connection',function(socket){
   console.log('User is connected to socket.io');
   
   socket.on('disconnect', function(){
       var userData = clientInfo[socket.id];
       if(typeof userData !== 'undefined'){
           socket.leave(userData.room);
           io.to(userData.room).emit('message',{
              name:'Sysetm',
              text: userData.name+' has left!',
              timestamp: moment.valueOf() 
           });
          delete clientInfo[socket.id];
       }
   });
   
   socket.on('joinRoom', function(req){
      clientInfo[socket.id] = req;
      socket.join(req.room);
      socket.broadcast.to(req.room).emit('message',{
        name:'System',
        text: req.name + ' has Joined!',
        timestamp: moment.valueOf()  
      });
   });
   
   socket.on('message', function(message){
      //console.log('Message Received: '+message.text);
      
      if(message.text === '@currentUsers'){
          sendCurrentUsers(socket);
      }else{
          message.timestamp = moment.valueOf();
          io.to(clientInfo[socket.id].room).emit('message',message);
      }
      
      // message.timestamp = moment().valueOf();
      // socket.broadcast.emit('message', message); // send message to all sender except sender
      // io.to(clientInfo[socket.id].room).emit('message', message); // send message to all users include sender
   });

   //new image get
    socket.on('newImg', function(imgData) {
        io.to(clientInfo[socket.id].room).emit('newImg', imgData);
    });

    socket.on("typing", function(data) {        
        socket.broadcast.to(clientInfo[socket.id].room).emit("isTyping", data);
    });
   
   /*socket.emit('message',{
       text: 'This is my first tweet'
   })*/
});

// Port Listen
http.listen(PORT, function(err){
   if(err){
       console.log(err);
   }else{
       console.log('Server running on '+PORT);
   }
});