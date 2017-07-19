'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();

describe('Apply filters to form responses', function() {
    it('should return the amount of form responses specified in the LIMIT param', function(done) {
        const LIMIT = 2;

        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
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
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[0].VALID_API_KEY,
                completed: true,
            })
            .query('order_by[]=date_land,desc')
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(validateDates)
            .end(done);

        function validateDates(res) {
            let responses = res.body.responses;
            let referenceDate = new Date(responses[0].metadata.date_submit);

            responses.forEach(response => {
                let currentDate = new Date(response.metadata.date_submit);
                let check = referenceDate.getTime() >= currentDate.getTime();

                chai.expect(check).to.be.true;

                referenceDate = currentDate;
            });
        }
    });
});
