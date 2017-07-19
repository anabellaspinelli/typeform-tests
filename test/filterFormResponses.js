'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();

describe('Apply filters to form responses', function() {
    it('should return the amount of form responses specified in the LIMIT param', function(done) {
        const LIMIT = 2;

        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].VALID_FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[0].VALID_API_KEY,
                limit: LIMIT
            })
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(validateLimit)
            .end(done);

        function validateLimit(res) {
            chai.expect(res.body.responses).to.have.a.lengthOf(LIMIT);
        }
    });

    it('should return form responses ordered by descending submit date', function(done) {
        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].VALID_FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[0].VALID_API_KEY,
                completed: true
            })
            .query('order_by[]=date_land,desc')
            .expect(res => utils.report.showServerResponseBody(res, this))
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(validateDates)
            .end(done);

        function validateDates(res) {
            let responses = res.body.responses;
            let referenceDate = new Date(responses[0].metadata.date_submit);

            responses.forEach(response => {
                let currentDate = new Date(response.metadata.date_submit);

                chai.expect(referenceDate.getTime() >= currentDate.getTime()).to.be.true;
                referenceDate = currentDate;
            });
        }
    });

    it('should return the form response requested by its token', function(done) {
        utils.fetchData.getFormResponses(ACCOUNT_DATA[0].VALID_FORM_UID, ACCOUNT_DATA[0].VALID_API_KEY, test, this);

        function test(formResponses, context) {
            let firstResponse = formResponses.body.responses[0];

            typeformDataAPI
                .get(`/form/${ACCOUNT_DATA[0].VALID_FORM_UID}`)
                .query({
                    key: ACCOUNT_DATA[0].VALID_API_KEY,
                    token: firstResponse.token
                })
                //    TODO improve sending the context as arg
                .expect(res => { utils.report.showServerResponseBody(res, context); })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(schemaToBeCorrect)
                .end(done);

            function schemaToBeCorrect(res) {
                chai.expect(res.body).to.have.property('http_status').that.is.a('number');

                // Form response stats
                chai.expect(res.body).to.have.property('stats').that.is.an('object');

                let stats = res.body.stats;

                chai.expect(stats).to.have.property('responses').that.is.an('object');
                chai.expect(stats.responses).to.have.property('showing').that.is.a('number');
                chai.expect(stats.responses.showing).to.equal(1);

                // Questions schema is validated in getResponsesByUID
                chai.expect(res.body).to.have.property('questions').that.is.an('array');

                // Response details, validating schema in this scenario
                chai.expect(res.body).to.have.property('responses').that.is.an('array');
                chai.expect(res.body.responses).to.have.a.lengthOf(1);

                let response = res.body.responses[0];

                chai.expect(response).to.have.property('token').that.is.a('string');
                chai.expect(response).to.have.property('completed').that.is.a('string');
                chai.expect(response).to.have.property('metadata').that.is.a('object');
                chai.expect(response).to.have.property('hidden').that.is.a('array');
                chai.expect(response).to.have.property('answers').that.is.a('object');
            }
        }
    });

    it('should return form responses ordered by descending submit date');
    it('should return only form responses that have been completed');
    it('should return form responses starting from a given offset');
    it('should return form responses until a given date');
});
