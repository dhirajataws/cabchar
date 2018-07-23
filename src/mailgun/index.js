const axios_ = require('axios')
const logger = require('bunyan').createLogger({name:'mailgun'})
const config_ = {
    baseUrl :'https://api.mailgun.net/v3/sandboxdb455e5f6b734971a6f829305ba801e1.mailgun.org',
    domain:'sandboxdb455e5f6b734971a6f829305ba801e1.mailgun.org',
    // eslint-disable-next-line no-undef
    apiKey:`${process.env.MAILGUN_API_KEY}`,
}
// eslint-disable-next-line no-undef
export const mailgunPost = async function ({axios = axios_, config = config_ , mailParam}){
    logger.info('request recieved.')
    try {
        let req = {
            method: 'post',
            url: `${config.baseUrl}/${config.domain}/messages`,
            auth: {
                username: 'api',
                password: config.apiKey
            },
            params: {
                from: mailParam.from,
                to: mailParam.to,
                subject: mailParam.subject,
                text: mailParam.text
            }
        }
        const response =  await axios(req)
        if(response.status !== 200)
            throw new Error(response.status)
        return response.status
    } catch (e) {
        logger.error(e)
        throw e
    }
}