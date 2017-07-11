'use strict';

let accountData = require('../testData').getAccountData();

describe('Form by UID tests', function() {
    it('returns data and responses for a given UID', function(done) {
        typeformDataAPI
            .get('/form/B930Qx')
            .query({
                key: accountData.validAPIKey
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
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
});
