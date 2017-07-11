'use strict';

let accountData = require('../testData').getAccountData();

describe('API Key tests', function() {
    it('returns forms for a given API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({
                key: accountData.validAPIKey
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
            .end(done);

        function schemaValidationToBeCorrect(res) {
            chai.expect(res.body).to.be.an('array');
            res.body.forEach(form => {
                chai.expect(form).to.have.property('id').that.is.a('string');
                chai.expect(form).to.have.property('name').that.is.a('string');
            });
        }
    });
});
