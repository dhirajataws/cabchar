const sinon = require('sinon')
const assert = require('assert')
import {sendgridPost} from '../../../src/sendgrid'
var axios = require('axios')

describe('sendgrid',function(){
    let mailParam, req

    beforeEach(() => {
        process.env.SENDGRID_API_KEY = 100;
        mailParam = {
            from: 'testFrom@test.com',
            to: 'testTo@test.com',
            subject: 'Hello',
            text: 'Welcome to the team!'
        }
        req = {
            method: 'post',
            url: 'https://api.sendgrid.com/v3/mail/send',
            data: {
                personalizations: [{
                    to: [{email: mailParam.to}]
                }],
                from: {email: mailParam.from},
                subject: mailParam.subject,
                content: [{
                    type: 'text/plain', value: mailParam.text
                }]
            },
            // eslint-disable-next-line no-undef
            headers:{Authorization: `Bearer 100`}
        }
    })
    it('should be able to send test mail',async function(){
        axios = sinon.fake.returns(new Promise((resolve,reject) => {resolve({status:202})}))
        const status = await sendgridPost({axios, mailParam});
        assert(status === 202)
        assert(axios.called)
        assert(axios.calledWith(req)) //  test token read from process.env
    })
   it('should be able to catch error if status is not 202',async function(){
        // return 203. if return is not 202, then error is thrown from code
        axios = sinon.fake.returns(new Promise((resolve,reject) => {resolve({status:203})}))
        process.env.SENDGRID_API_KEY = 100;
        try{
            let result = await sendgridPost({axios, mailParam});
        }catch(e){
            assert(e.message === '203')
            assert(axios.called)
        }
    })
    it('should be able to throw error during send test mail',async function(){
        axios = sinon.fake.returns(new Promise((resolve,reject) => {throw new Error('internal service error')}))
        process.env.SENDGRID_API_KEY = 100;
        try{
             await sendgridPost({axios, mailParam});
        }catch(e){
            assert(e.message === 'internal service error')
            assert(axios.called)
        }
    })
})