const UUID = require('uuid-v4');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs');
const generateImage = require('./generate-image.js');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});


exports.generateCert = functions.https.onRequest((request, response) => {
    generateImage.writeNameToCert('cert.jpg', 'Emmanuel Lodovice', {x: 0, y: -50}).then((fname) => {
        uploadImage(fname).then((url) => {
            response.send(url);
        }).catch((err) => {
            response.send(err);
        });
    }).catch((err) => {
        response.send(err);
    });
});

function uploadImage(fname) {
    let dest = fname.split('/');
    dest = dest[dest.length - 1];
    let token = UUID();
    const bucketName = 'gdg-cebu-cert-gen.appspot.com';
    let bucket = admin.storage().bucket(bucketName);
    return bucket.upload(fname, {
        destination: dest,
        uploadType: 'media',
        metadata: {
            contentType: 'image/jpeg',
            metadata: {
                firebaseStorageDownloadTokens: token
            }
        }
    }).then((data) => {
        fs.unlinkSync(fname);
        return Promise.resolve(`https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${dest}?alt=media&token=${token}`)
    });
}