const gm = require('gm').subClass({imageMagick: true});



/**
 * Generates a certificate image with the name of the participant
 *
 * sourceImagePath {string} - path to the base cert image
 * name {string} - the name to write in the certificate
 * top {int} - distance in px from the top to write the name
 */
function writeNameToCert(sourceImagePath, name, coor, callback) {
    const fname = generateFilename();
    gm(sourceImagePath).fontSize(110).
        drawText(coor.x, coor.y, name, 'Center').
        write(fname, (err) => {
            callback(fname);
        });
}

function generateFilename() {
    var filename = (Math.floor(Math.random() * 100000000) + 1).toString(16);
    return filename + '.jpg';
}


// export default writeNameToCert;
function test(callback) {
    writeNameToCert('cert.jpg', 'Emmanuel Lodovice', {x: 0, y: -50}, callback)
}

exports.test = test;