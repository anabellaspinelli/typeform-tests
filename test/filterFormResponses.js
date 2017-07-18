'use strict';

let utils = require('./utils');

const ACCOUNT_DATA = require('./testData').getAccountData();

describe('apply filters to form responses', function() {
    it('should return the amount of form responses specified in the LIMIT param', function(done) {
        const LIMIT = 2;

        typeformDataAPI
            .get(`/form/${ACCOUNT_DATA[0].FORM_UID}`)
            .query({
                key: ACCOUNT_DATA[0].VALID_API_KEY,
                limit: LIMIT
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(validateLimit)
            .expect(res => { utils.report.showServerResponseBody(res, this); })
            .end(done);

        function validateLimit(res) {
            chai.expect(res.body.responses).to.have.a.lengthOf(LIMIT);
        }
    });

    it('should return form responses ordered by descending submit date');
});
