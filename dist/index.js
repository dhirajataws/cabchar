'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.app = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _routes = require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var Router = require('koa-router');


var PROTOCOL = 'http';
var HOST = '0.0.0.0';
var PORT = 8000;
var app = exports.app = new Koa();
var router = new Router();

app.use(require('koa-body')()).use(router.allowedMethods()).use(router.routes());

var handler = (0, _routes.memotized)();
router.post('/sendmail', function (ctx) {
    return handler({ ctx: ctx });
});
router.get('/healthcheck', function (ctx) {
    ctx.body = 'ok';
});

app.listen(PORT, HOST, function () {
    // eslint-disable-next-line no-console
    console.log(_chalk2.default.grey(_chalk2.default.green('Listening on') + ': ' + PROTOCOL + '://' + _chalk2.default.cyan(HOST + ':' + PORT)));
});