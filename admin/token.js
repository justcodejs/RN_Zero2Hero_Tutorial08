var admin = require("firebase-admin");
var serviceAccount = require("./path/to/your/own/admin/sdk/json/file");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-firebase-project-id.firebaseio.com"
});

var message = {
  notification: {
    title: 'Test Notification',
    body: 'This is a test notifcation to test token.'
  },
  data: {
    
  },
  android: {
    notification: {
      sound: 'default',
      visibility: 'public'
    }
  },
  apns: {
    payload: {
      aps: {
        sound: 'default'
      }
    }
  },
  token: 'your device token'
};

admin.messaging().send(message)
.then(response => {
  console.log('Successfully sent message: ', response);
})
.catch(error => {
  console.log('Error sending message: ', error);
});