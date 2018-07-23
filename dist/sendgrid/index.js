'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var axios_ = require('axios');
var logger = require('bunyan').createLogger({ name: 'sendgrid' });

var sendgridPost = exports.sendgridPost = async function sendgridPost(_ref) {
    var _ref$axios = _ref.axios,
        axios = _ref$axios === undefined ? axios_ : _ref$axios,
        mailParam = _ref.mailParam;

    logger.info('request recieved.');
    try {
        var req = {
            method: 'post',
            url: 'https://api.sendgrid.com/v3/mail/send',
            data: {
                personalizations: [{
                    to: [{ email: mailParam.to }]
                }],
                from: { email: mailParam.from },
                subject: mailParam.subject,
                content: [{
                    type: 'text/plain', value: mailParam.text
                }]
            },
            // eslint-disable-next-line no-undef
            headers: { Authorization: 'Bearer ' + process.env.SENDGRID_API_KEY }
        };
        var response = await axios(req);
        if (response.status !== 202) throw new Error(response.status);
        return response.status;
    } catch (e) {
        logger.error(e);
        throw e;
    }
};