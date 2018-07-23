const axios_ = require('axios')
const logger = require('bunyan').createLogger({name:'sendgrid'})

export const sendgridPost = async function ({axios = axios_, mailParam}){
    logger.info('request recieved.')
    try {
        let req = {
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
            headers:{Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`}
        }
        const response = await axios(req)
        if(response.status !== 202)
            throw new Error(response.status)
        return response.status
    } catch (e) {
        logger.error(e)
        throw e
    }
}

