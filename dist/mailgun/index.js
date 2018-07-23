'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var axios_ = require('axios');
var logger = require('bunyan').createLogger({ name: 'mailgun' });
var config_ = {
    baseUrl: 'https://api.mailgun.net/v3/sandboxdb455e5f6b734971a6f829305ba801e1.mailgun.org',
    domain: 'sandboxdb455e5f6b734971a6f829305ba801e1.mailgun.org',
    // eslint-disable-next-line no-undef
    apiKey: '' + process.env.MAILGUN_API_KEY
    // eslint-disable-next-line no-undef
};var mailgunPost = exports.mailgunPost = async function mailgunPost(_ref) {
    var _ref$axios = _ref.axios,
        axios = _ref$axios === undefined ? axios_ : _ref$axios,
        _ref$config = _ref.config,
        config = _ref$config === undefined ? config_ : _ref$config,
        mailParam = _ref.mailParam;

    logger.info('request recieved.');
    try {
        var req = {
            method: 'post',
            url: config.baseUrl + '/' + config.domain + '/messages',
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
        };
        var response = await axios(req);
        if (response.status !== 200) throw new Error(response.status);
        return response.status;
    } catch (e) {
        logger.error(e);
        throw e;
    }
};