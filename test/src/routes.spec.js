import {memotized} from "../../src/routes";

const assert = require('assert')
describe('requestSplitter ', function () {
    let sendgrid_, mailgun_, ctx;
    beforeEach(function () {
        sendgrid_ = function () {
            return new Promise(function (resolve, reject) {
                resolve(202)
            });
        }

        mailgun_ = function () {
            return new Promise(function (resolve, reject) {
                resolve(200)
            });
        }
        ctx = {
            query: {
                from: 'testFrom@test.com',
                to: 'testTo@test.com',
                subject: 'Hello',
                text: 'Welcome to the team!'
            }
        }
    })

    it('should distribute load', async function () {
        const handler = memotized()
        let result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 202)
        result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 200);
        result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 202);
        result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 200);
    })
    it('should test sendgrid failover.Sendgrid fails but mailgun returns good', async function () {
        sendgrid_ = function () {
            return new Promise(function (resolve, reject) {
                throw new Error(203) //error
            });
        }
        const handler = memotized()
        let result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 200)
    })
    it('should test mailgun failover.mailgun fails but sendgrid returns good', async function () {
        mailgun_ = function () {
            return new Promise(function (resolve, reject) {
                throw new Error(203) // error
            });
        }
        const handler = memotized()
        let result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 202)
        result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 202);
    })
    it('should test exceptions are catched', async function () {
        sendgrid_ = function () {
            return new Promise(function (resolve, reject) {
                throw Error(203)
            });
        }
        mailgun_ = function () {
            return new Promise(function (resolve, reject) {
                throw new Error(203) // error
            });
        }
        const handler = memotized()
        const result = await handler({ctx, sendgrid_, mailgun_})
        assert(result.status === 500)
    })
})
