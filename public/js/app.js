'use strict';
var socket = io();

socket.on('connect',function(){
   console.log('Connected to server'); 
});

socket.on('message', function(message){
    var momentTime = moment.utc(message.timestamp);
   console.log('New Message: '+message.text);
   jQuery('.message').append('<p>'+momentTime.local().format('MMM Do YYYY hh:mm a')+' : '+message.text+'</p>') 
});

// Submit Message
var $form = jQuery('#message-form');

$form.on('submit',function(event){
    event.preventDefault();
    
    var $message = $form.find('input[name=message]'); 
    
    socket.emit('message',{
       text: $message.val()
    });
    
    $message.val('');
    $message.focus();
    
});