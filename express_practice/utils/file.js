const { error } = require('console');
const fs = require('fs');

const deleteFile = (path) => {
    fs.unlink(path, (error) => {
        if(error) {
            throw (error);
        }
    });
}

exports.deleteFile = deleteFile;