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
   var msg = showEmoji(message.text);
   //console.log('New Message: '+message.text);
   $message.append('<li class="left clearfix"><span class="chat-img pull-left"><img width="40" src="img/chat-icon.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+message.name+'</strong><small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span> '+momentTime.local().format('hh:mm a')+'</small></div><p>'+msg+'</p></div></li>');
   $('#scroll').animate({scrollTop: $('#scroll')[0].scrollHeight});
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

// Emoji Integration
this.initialEmoji();

document.getElementById('emoji').addEventListener('click', function(e) {
    var emojiwrapper = document.getElementById('emojiWrapper');
    emojiwrapper.style.display = 'block';
    e.stopPropagation();
}, false);
document.body.addEventListener('click', function(e) {
    var emojiwrapper = document.getElementById('emojiWrapper');
    if (e.target != emojiwrapper) {
        emojiwrapper.style.display = 'none';
    };
});
document.getElementById('emojiWrapper').addEventListener('click', function(e) {
    var target = e.target;
    if (target.nodeName.toLowerCase() == 'img') {
        var messageInput = document.getElementById('messageInput');; 
        messageInput.focus();
        messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
    };
}, false);

function initialEmoji(){
    var emojiContainer = document.getElementById('emojiWrapper'),
        docFragment = document.createDocumentFragment();
    for (var i = 69; i > 0; i--) {
        var emojiItem = document.createElement('img');
        emojiItem.src = '../content/emoji/' + i + '.gif';
        emojiItem.title = i;
        docFragment.appendChild(emojiItem);
    };
    emojiContainer.appendChild(docFragment);
}

function showEmoji(msg) {
    var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    while (match = reg.exec(msg)) {
        emojiIndex = match[0].slice(7, -1);
        if (emojiIndex > totalEmojiNum) {
            result = result.replace(match[0], '[X]');
        } else {
            result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
        };
    };
    return result;
}