const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs');
const generateImage = require('./generate-image.js');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});


exports.generateCert = functions.https.onRequest((request, response) => {
    generateImage.writeNameToCert('cert.jpg', 'Emmanuel Lodovice', {x: 0, y: -50}).then((fname) => {
        uploadImage(fname).then((data) => {
            fs.unlinkSync(fname);
            response.send(data);
        }).catch((err) => {
            response.send(err);
        });
    }).catch((err) => {
        console.log(err);
        response.send(err);
    });
});

function uploadImage(fname) {
    let dest = fname.split('/');
    dest = dest[dest.length - 1];
    let bucket = admin.storage().bucket('gdg-cebu-cert-gen.appspot.com');
    return bucket.upload(fname, {destination: dest});
}