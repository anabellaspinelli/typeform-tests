let fs = require('fs');
let path = require('path');

function getAccountData() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'accountData.json')));
}

module.exports = {
    getAccountData
};
