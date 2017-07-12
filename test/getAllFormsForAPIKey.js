'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();

describe('/forms API Key tests', function() {
    it('returns forms for a given API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({ key: ACCOUNT_DATA.validAPIKey })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
            .expect(res => { utils.report.showServerResponseBody(res, this); })
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
