'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.memotized = undefined;

var _sendgrid = require('./sendgrid');

var _mailgun = require('./mailgun');

var logger = require('bunyan').createLogger({ name: 'index' });
var memotized = exports.memotized = function memotized() {
    var count = 0;
    async function requestSplitter(_ref) {
        var ctx = _ref.ctx,
            _ref$sendgrid_ = _ref.sendgrid_,
            sendgrid_ = _ref$sendgrid_ === undefined ? _sendgrid.sendgridPost : _ref$sendgrid_,
            _ref$mailgun_ = _ref.mailgun_,
            mailgun_ = _ref$mailgun_ === undefined ? _mailgun.mailgunPost : _ref$mailgun_;

        count++;

        var queryParams = ctx.query;
        if (!(queryParams.to && queryParams.from && queryParams.subject && queryParams.text)) {
            logger.error('Missing Mandatory Fields');
            ctx.status = 400;
            return ctx;
        }
        var mailParam = {
            from: 'testFrom@test.com',
            to: 'testTo@test.com',
            subject: 'Hello',
            text: 'Welcome to the team!'
        };
        try {
            if (count % 2) {
                try {
                    ctx.status = await sendgrid_({ mailParam: mailParam });
                    return ctx; // status === 202
                } catch (err) {
                    logger.error(err);
                    try {
                        ctx.status = await mailgun_({ mailParam: mailParam });
                        return ctx; // status === 200
                    } catch (err) {
                        logger.error(err);
                        throw new Error('Both Email Provider Failed');
                    }
                }
            } else {
                try {
                    ctx.status = await mailgun_({ mailParam: mailParam });
                    return ctx;
                } catch (err) {
                    logger.error(err);
                    try {
                        ctx.status = await sendgrid_({ mailParam: mailParam });
                        return ctx;
                    } catch (err) {
                        logger.error(err);
                        throw new Error('Both Email Provider Failed');
                    }
                }
            }
        } catch (err) {
            logger.error(err);
            ctx.status = 500;
            return ctx;
        }
    }
    return requestSplitter;
};