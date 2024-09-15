var admin = require("firebase-admin");
var serviceAccount = require("../autofix-3cbff-firebase-adminsdk-u3q1a-c7c81fec7a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://autofix-3cbff.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
