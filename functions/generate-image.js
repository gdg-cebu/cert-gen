const gm = require('gm').subClass({imageMagick: true});
const os = require('os');
const UUID = require('uuid-v4');



/**
 * Generates a certificate image with the name of the participant
 *
 * sourceImagePath {string} - path to the base cert image
 * name {string} - the name to write in the certificate
 * top {int} - distance in px from the top to write the name
 */
function writeNameToCert(sourceImagePath, name, coor) {
    const fname = generateFilename();
    return new Promise(function(resolve, reject) {
        gm(sourceImagePath).fontSize(70).font('./Roboto-Regular.ttf').
            drawText(coor.x, coor.y, name, 'Center').
            write(fname, (err) => {
                if (err) {
                    console.log(err, 'error');
                    reject(err);
                } else {
                    resolve(fname);
                }
            });
    });
}

function generateFilename() {
    let token = UUID();
    return `${os.tmpdir()}/${token}.jpg`;
}


exports.writeNameToCert = writeNameToCert;