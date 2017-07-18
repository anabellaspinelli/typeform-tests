'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();
const INVALID_DATA = require('./testData').getInvalidData();

describe('Get forms for an API key', function() {
    it('should return forms for a given API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({ key: ACCOUNT_DATA[0].VALID_API_KEY })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaToBeCorrect)
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .end(done);

        function schemaToBeCorrect(res) {
            chai.expect(res.body).to.be.an('array');
            res.body.forEach(form => {
                chai.expect(form).to.have.property('id').that.is.a('string');
                chai.expect(form).to.have.property('name').that.is.a('string');
            });
        }
    });

    it('should return 403 when requesting forms with an invalid API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({ key: INVALID_DATA.INVALID_API_KEY })
            .expect(403)
            .expect('Content-Type', /json/)
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .end(done);
    });
});
