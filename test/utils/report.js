'use strict';

const addContext = require('mochawesome/addContext');

function showServerResponseBody(res, testObj) {
    addContext(testObj, {
        title: 'Server Response',
        value: res.body
    });
}

module.exports = {
    showServerResponseBody
};
