const gm = require('gm').subClass({imageMagick: true});
const os = require('os');



/**
 * Generates a certificate image with the name of the participant
 *
 * sourceImagePath {string} - path to the base cert image
 * name {string} - the name to write in the certificate
 * top {int} - distance in px from the top to write the name
 */
function writeNameToCert(sourceImagePath, name, coor) {
    const fname = generateFilename(name);
    return new Promise(function(resolve, reject) {
        gm(sourceImagePath).fontSize(110).font('./Roboto-Regular.ttf').
            drawText(coor.x, coor.y, name, 'Center').
            write(fname, (err) => {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(fname);
                }
            });
    });
}

function generateFilename(name) {
    name = name.replace(/\s/g, "");
    var filename = (Math.floor(Math.random() * 100000000) + 1).toString(16);
    return `${os.tmpdir()}/${name}${filename}.jpg`;
}


exports.writeNameToCert = writeNameToCert;