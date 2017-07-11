let request = require('supertest')('https://api.typeform.com/v1');
let chai = require('chai');
let expect = chai.expect;

describe('Typeform Data API basic tests', function() {
    it('returns data for a given UID', function(done) {
        request
            .get('/form/B930Qx')
            .query({
                key: 'db0d6fc53f49ad97f0dcad9bd1ae2efdfda14e4c'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
            .end(done);

        function schemaValidationToBeCorrect(res) {
            console.log(res.body);
            expect(res.body).to.have.property('http_status').that.is.a('number');

            // Form responses stats
            expect(res.body).to.have.property('stats').that.is.an('object');
            expect(res.body.stats).to.have.property('responses').that.is.an('object');
            expect(res.body.stats.responses).to.have.property('showing').that.is.a('number');
            expect(res.body.stats.responses).to.have.property('total').that.is.a('number');
            expect(res.body.stats.responses).to.have.property('completed').that.is.a('number');

            // Questions details
            expect(res.body).to.have.property('questions').that.is.an('array');
            res.body.questions.forEach(question => {
                expect(question).to.have.property('id').that.is.a('string');
                expect(question).to.have.property('question').that.is.a('string');
                expect(question).to.have.property('field_id').that.is.a('number');
            });

            // Responses details
            expect(res.body).to.have.property('responses').that.is.an('array');
            res.body.responses.forEach(response => {
                expect(response).to.have.property('token').that.is.a('string');
                expect(response).to.have.property('completed').that.is.a('string');
                expect(response).to.have.property('metadata').that.is.a('object');
                expect(response).to.have.property('hidden').that.is.a('array');
                expect(response).to.have.property('answers').that.is.a('object');
            });
        }
    });
});
