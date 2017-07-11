let request = require('supertest')('https://api.typeform.com/v1');
let chai = require('chai');
let expect = chai.expect;

describe('Typeform Data API basic tests', function() {
    it('returns forms for a given API key', function(done) {
        request
            .get('/forms')
            .query({
                key: 'db0d6fc53f49ad97f0dcad9bd1ae2efdfda14e4c'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(schemaValidationToBeCorrect)
            .end(done);

        function schemaValidationToBeCorrect(res) {
            expect(res.body).to.be.an('array');
            res.body.forEach(form => {
                expect(form).to.have.property('id').that.is.a('string');
                expect(form).to.have.property('name').that.is.a('string');
            });
        }
    });
});
