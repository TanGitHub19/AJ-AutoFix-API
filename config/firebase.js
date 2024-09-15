var admin = require("firebase-admin");
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://autofix-3cbff.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
