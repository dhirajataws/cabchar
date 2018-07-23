const logger = require('bunyan').createLogger({name:'index'})
import {sendgridPost} from './sendgrid'
import {mailgunPost} from './mailgun'

export const memotized = function() {
    let count = 0
    async function requestSplitter({ctx, sendgrid_ = sendgridPost, mailgun_ = mailgunPost}) {
        count++

        let queryParams = ctx.query
        if(!(queryParams.to && queryParams.from && queryParams.subject && queryParams.text)){
            logger.error('Missing Mandatory Fields')
            ctx.status = 400
            return ctx
        }
        const mailParam = {
            from: 'testFrom@test.com',
            to: 'testTo@test.com',
            subject: 'Hello',
            text: 'Welcome to the team!'
        }
        try {
            if (count % 2) {
                try {
                    ctx.status = await sendgrid_({mailParam})
                    return ctx // status === 202
                }catch(err){
                    logger.error(err)
                    try {
                        ctx.status = await mailgun_({mailParam})
                        return ctx // status === 200
                    }catch(err){
                        logger.error(err)
                        throw new Error('Both Email Provider Failed')
                    }
                }
            } else {
                try {
                    ctx.status = await mailgun_({mailParam})
                    return ctx
                }catch(err){
                    logger.error(err)
                    try{
                        ctx.status = await sendgrid_({mailParam})
                        return ctx
                    }catch(err){
                        logger.error(err)
                        throw new Error('Both Email Provider Failed')
                    }
                }
            }
        }catch(err){
            logger.error(err)
            ctx.status = 500
            return ctx
        }
    }
    return requestSplitter
}
