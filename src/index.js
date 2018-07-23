'use strict'
import c from 'chalk'
const Koa = require('koa')
const Router = require('koa-router')
import {memotized} from './routes'

const PROTOCOL = 'http'
const HOST = '0.0.0.0'
const PORT = 8000
export const app = new Koa()
const router = new Router()

app
    .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes())

const handler = memotized()
router.post('/sendmail',ctx => handler({ctx}))
router.get('/healthcheck', ctx => {
    ctx.body = 'ok'
})

app.listen(PORT, HOST, () =>{
    // eslint-disable-next-line no-console
    console.log(c.grey(`${c.green('Listening on')}: ${PROTOCOL}://${c.cyan(`${HOST}:${PORT}`)}`))
})