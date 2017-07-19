'use strict';

let utils = require('./utils');
let addContext = require('mochawesome/addContext');

const ACCOUNT_DATA = require('./testData').getAccountData();
const INVALID_DATA = require('./testData').getInvalidData();

describe('Form responses by UID', function() {
    it('should return data and responses for a given UID', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({key: ACCOUNT_DATA[0].VALID_API_KEY})
            .expect(res => {
                utils.report.showServerResponseBody(res, this);
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaToBeCorrect)
            .end(done);

        function schemaToBeCorrect(res) {
            chai.expect(res.body).to.have.property('http_status').that.is.a('number');

            // Form responses stats
            chai.expect(res.body).to.have.property('stats').that.is.an('object');
            chai.expect(res.body.stats).to.have.property('responses').that.is.an('object');
            chai.expect(res.body.stats.responses).to.have.property('showing').that.is.a('number');
            chai.expect(res.body.stats.responses).to.have.property('total').that.is.a('number');
            chai.expect(res.body.stats.responses).to.have.property('completed').that.is.a('number');

            // Questions details
            chai.expect(res.body).to.have.property('questions').that.is.an('array');
            res.body.questions.forEach(question => {
                chai.expect(question).to.have.property('id').that.is.a('string');
                chai.expect(question).to.have.property('question').that.is.a('string');
                chai.expect(question).to.have.property('field_id').that.is.a('number');
            });

            // Responses details
            chai.expect(res.body).to.have.property('responses').that.is.an('array');
            res.body.responses.forEach(response => {
                chai.expect(response).to.have.property('token').that.is.a('string');
                chai.expect(response).to.have.property('completed').that.is.a('string');
                chai.expect(response).to.have.property('metadata').that.is.a('object');
                chai.expect(response).to.have.property('hidden').that.is.a('array');
                chai.expect(response).to.have.property('answers').that.is.a('object');
            });
        }
    });
});

describe('Form responses by UID - NEGATIVE', function() {

    it('should return 404 error requesting an invalid form UID', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA.registrationFormUID}`)
            .query({
                key: ACCOUNT_DATA[0].VALID_API_KEY
            })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(404)
            .expect('Content-Type', /json/)
            .expect({ message: 'typeform with uid undefined was not found', status: 404 })
            .end(done);
    });

    it('should return 403 error requesting a valid form UID with invalid API Key', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({
                key: INVALID_DATA.INVALID_API_KEY
            })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(403)
            .expect('Content-Type', /json/)
            .expect({ message: 'please provide a valid API key', status: 403 })
            .end(done);
    });

    it('should return 403 error requesting a valid form UID with a different user API Key', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[1].VALID_API_KEY
            })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(403)
            .expect('Content-Type', /json/)
            .expect({ message: 'please provide a valid API key', status: 403 })
            .end(done);
    });

    it('should return 403 error requesting a valid form UID the owners old API key', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[0].OLD_API_KEY
            })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(403)
            .expect('Content-Type', /json/)
            .expect({ message: 'please provide a valid API key', status: 403 })
            .end(done);
    });
});
