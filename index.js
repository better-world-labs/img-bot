const Koa = require('koa');
const koaBody = require('koa-body');

const config = require('config');
const app = new Koa();
const serve = require('./lib/serve.js')

// response
app
    .use(koaBody())
    .use(async ctx => {
        if (ctx.path == '/call' && ctx.method == 'POST') {
            await serve(ctx)
        } else {
            ctx.body = 'not found';
            ctx.status = 404;
        }
    })
    .listen(config.port);