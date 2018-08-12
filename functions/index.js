const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs');
const test = require('./generate-image.js');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.helloWorld = functions.https.onRequest((request, response) => {
    test.test((fname) => {
        uploadImage(fname).then((url) => {
            response.send(url);
        });
    });
});

function uploadImage(fname) {
    return new Promise((resolve, reject) => {
        let bucket = admin.storage().bucket('gdg-cebu-cert-gen');
        let fileupload = bucket.file(fname);

        fs.createReadStream(fname)
            .pipe( fileupload.createWriteStream({
                metadata: {
                    contentType: 'image/jpeg'
                }
            }))
            .on('finish', () => {
                const url = `https://storage.googleapis.com/${fname}`;
                resolve(url);
            });
    });

}
