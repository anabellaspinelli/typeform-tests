'use strict';

let utils = require('./utils');
let addContext = require('mochawesome/addContext');

const ACCOUNT_DATA = require('./testData').getAccountData();

describe('/form by UID tests', function() {
    it('returns data and responses for a given UID', function (done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA.registrationFormUID}`)
            .query({ key: ACCOUNT_DATA.validAPIKey })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .end(done);

        function schemaValidationToBeCorrect(res) {
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

    it('returns 403 error requesting form with invalid API Key', function (done) {
        typeformDataAPI
            .get('/form/B930Qx')
            .query({
                key: 'invalidKey'
            })
            .expect(403)
            .expect('Content-Type', /json/)
            .expect({ message: 'please provide a valid API key', status: 403 })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .end(done);
    });
});
