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
   
   console.log('New Message: '+message.text);
   $message.append('<p><strong>'+message.name+'</strong> '+momentTime.local().format('hh:mm a')+'</p>')
   $message.append('<p>'+message.text+'</p>');
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