'use strict';
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name+' '+room);
jQuery('.room').text(room);
socket.on('connect',function(){
   console.log('Connected to server'); 
});

socket.on('message', function(message){
   var momentTime = moment.utc(message.timestamp);
   var $message = jQuery('.message');
   
   console.log('New Message: '+message.text);
   $message.append('<p><strong>'+message.name+'</strong> '+momentTime.local().format('hh:mm a')+'</p>')
   $message.append('<p>'+message.text+'</p>');
   //notifyMe(message.text);
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