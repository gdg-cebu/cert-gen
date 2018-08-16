const UUID = require('uuid-v4');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs');
const generateImage = require('./generate-image.js');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});


exports.generateCert = functions.https.onRequest((request, response) => {
    const id = request.query.id;
    const docRef = admin.firestore().collection('participants-io').doc(id)
    docRef.get().then(doc => {
        if (!doc.exists) {
            response.status(404).send('does not exists!');
        }
        let data = doc.data();
        if (data.imageUrl) {
            response.set({
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            }).send(data.imageUrl);
        } else {
            generateImage.writeNameToCert('cert.jpg', data.name, {x: 0, y: -50}).then((fname) => {
                uploadImage(fname).then((url) => {
                    data.imageUrl = url;
                    doc.ref.set(data);
                    response.set({
                      'Content-Type': 'text/plain',
                      'Access-Control-Allow-Origin': '*'
                    }).send(url);
                }).catch((err) => {
                    response.status(400).send(err);
                });
            }).catch((err) => {
                response.status(400).send(err);
            });
        }
    })

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