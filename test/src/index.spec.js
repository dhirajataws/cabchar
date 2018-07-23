const assert = require('assert')
describe('package.json should ',() =>{
    it('koa , koa-body, koa-router, axios, bunyan is in package.json',()=>{
        const koa = require('koa')
        assert(koa !== undefined);
        const koaRouter = require('koa-router')
        assert(koaRouter !== undefined);
        const koaBody = require('koa-body')
        assert(koaBody !== undefined);
        const axios = require('axios')
        assert(axios !== undefined)
        const bunyan = require('bunyan')
        assert(bunyan !== undefined)
    })
})