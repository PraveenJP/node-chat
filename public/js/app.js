'use strict';
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

// Check Window is active or not

var isActive;

window.onfocus = function () { 
  isActive = true; 
}; 

window.onblur = function () { 
  isActive = false; 
}; 

// End Check

//console.log(name+' '+room);
jQuery('.room').text(room);
jQuery('.user').text(name);

// Check User Connection
socket.on('connect',function(){
   console.log('Connected to server'); 
   socket.emit('joinRoom',{
       name:name,
       room:room
   });
});

//Get Message
socket.on('message', function(message){
   var momentTime = moment.utc(message.timestamp);
   var $message = jQuery('.message');
   
   //console.log('New Message: '+message.text);
   $message.append('<li class="left clearfix"><span class="chat-img pull-left"><img width="40" src="img/chat-icon.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+message.name+'</strong><small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span> '+momentTime.local().format('hh:mm a')+'</small></div><p>'+message.text+'</p></div></li>');
   if(isActive == false){
      notifyMe(message.text,message.name);   
   }
});

// Submit Message
var $form = jQuery('#message-form');

$form.on('submit',function(event){
    event.preventDefault();
    
    var $message = $form.find('input[name=message]'); 
    
    socket.emit('message',{
       name : name,
       text: $message.val()
    });
    
    $message.val('');
    $message.focus();
    
});

setInterval(function(){ 
    $("#scroll").scrollTop($("#scroll")[0].scrollHeight);
}, 1000);