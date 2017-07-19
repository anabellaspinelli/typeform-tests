'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();
const INVALID_DATA = require('./testData').getInvalidData();

describe('Get forms for an API key', function() {
    it('should return forms for a given API key', function (done) {
        typeformDataAPI
            .get('/forms')
            .query({key: ACCOUNT_DATA[0].VALID_API_KEY})
            .expect(res => {
                utils.report.showServerResponseBody(res, this);
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaToBeCorrect)
            .end(done);

        function schemaToBeCorrect(res) {
            chai.expect(res.body).to.be.an('array');
            res.body.forEach(form => {
                chai.expect(form).to.have.property('id').that.is.a('string');
                chai.expect(form).to.have.property('name').that.is.a('string');
            });
        }
    });
});

describe('Get forms for an API key - NEGATIVE', function(done) {
    it('should return 403 when requesting forms with an invalid API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({ key: INVALID_DATA.INVALID_API_KEY })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(403)
            .expect('Content-Type', /json/)
            .end(done);
    });

    it.skip('should return 403 when requesting forms with an old API key', function(done) {
        typeformDataAPI
            .get('/forms')
            .query({ key: ACCOUNT_DATA.OLD_API_KEY})
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(403)
            .expect('Content-Type', /json/)
            .end(done);
    });
});
