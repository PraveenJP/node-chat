function notifyMe(message,name) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
        var options = {
                body: message,
                icon: "../img/chat-icon.png",
                dir : "ltr"
             };
          var notification = new Notification(name,options);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    
      if (permission === "granted") {
        var options = {
              body: message,
              icon: "../img/chat-icon.png",
              dir : "ltr"
          };
        var notification = new Notification(name,options);
      }
    });
  }
}