let fs = require('fs');
let path = require('path');

function getAccountData() {
    return readTestDataFile('accountsData.json');
}

function getInvalidData() {
    return readTestDataFile('invalid.json');
}

function readTestDataFile(filename) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, filename)));
}

module.exports = {
    getAccountData,
    getInvalidData
};
