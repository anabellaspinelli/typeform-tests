'use strict';

function getFormResponses(formUID, apiKey, callback, context) {
    typeformDataAPI
        .get(`/form/${formUID}`)
        .query({
            key: apiKey,
            completed: true
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) throw err;

            callback(res, context);
        });
}

module.exports = {
    getFormResponses
};
