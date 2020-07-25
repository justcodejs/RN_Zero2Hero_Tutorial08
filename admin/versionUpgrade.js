var admin = require("firebase-admin");
var serviceAccount = require("./path/to/your/own/admin/sdk/json/file");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-firebase-project-id.firebaseio.com"
});

var message = {
  data: {
    msgType: 'VersionUpgrade',
    nextVer: '2',
    ios: 'https://apps.apple.com/us/app/id1161243898',
    android: 'https://play.google.com/store/apps/details?id=net.justnice.calgame'
  },
  android: {
    priority: "high"
  },
  apns: {
    payload: {
      aps: {
        "content-available": 1
      }
    }
  },
  topic: 'version_upgrade'
};

admin.messaging().send(message)
.then(response => {
  console.log('Successfully sent message: ', response);
})
.catch(error => {
  console.log('Error sending message: ', error);
});