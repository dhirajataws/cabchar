const sinon = require('sinon')
const assert = require('assert')
import {mailgunPost} from '../../../src/mailgun'
var axios = require('axios')

describe('mailgun',function(){
    let mailParam, config, req

    beforeEach(() => {
        process.env.MAILGUN_API_KEY = 100;
        mailParam = {
            from: 'testFrom@test.com',
            to: 'testTo@test.com',
            subject: 'Hello',
            text: 'Welcome to the team!'
        }
        config = {
            baseUrl :'baseurl',
            domain:'publicDomain',
            // eslint-disable-next-line no-undef
            apiKey:`${process.env.MAILGUN_API_KEY}`,
        }
        req = {
            method: 'post',
            url: `${config.baseUrl}/${config.domain}/messages`,
            auth: {
                username: 'api',
                password: config.apiKey
            },
            params:mailParam
        }
    })
    it('should be able to send test mail',async function(){
        axios = sinon.fake.returns(new Promise((resolve,reject) => {resolve({status:200})}))
        const status = await mailgunPost({axios, config , mailParam});
        assert(status === 200)
        assert(axios.called)
        assert(axios.calledWith(req)) //  test token read from process.env
    })
    it('should be able to catch error if status is not 200',async function(){
        // return 203. if return is not 200, then error is thrown from code
        axios = sinon.fake.returns(new Promise((resolve,reject) => {resolve({status:203})}))
        try{
            let result = await mailgunPost({axios, mailParam});
        }catch(e){
            console.log(e.message)
            assert(e.message === '203')
            assert(axios.called)
        }
    })
    it('should be able to throw error during mailgun test mail',async function(){
        axios = sinon.fake.returns(new Promise((resolve,reject) => {throw new Error('internal service error')}))
        try{
             await mailgunPost({axios, mailParam});
        }catch(e){
            assert(e.message === 'internal service error')
            assert(axios.called)
        }
    })
})