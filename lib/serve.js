//处理http请求，对外提供服务
const path = require('path');
const config = require('config');
const imgBot = require('./img-bot');
const Tpl = require('./tpl')

let saveMiddleware
function init() {
    const saveMiddlewareFactoryPath = `./save/${config.save.type}`;
    const saveMiddlewareFactory = require(saveMiddlewareFactoryPath)
    saveMiddleware = saveMiddlewareFactory(config.save)
}

init();


/**
 * api
 * ```http
 * 		POST /call
 * 		{
 * 			"tplName": "example",
 * 			"args": {
 * 				...
 * 			},
 * 			"save":{
 * 				...
 * 			},
 * 		}
 * ```
 */
async function serve(ctx) {
    try {
        //1. 解析和检查参数
        const { tplName, args, save } = ctx.request.body;
        const errMsg = Tpl.checkArgs(tplName, args)
        if (errMsg) {
            ctx.status = 400;
            ctx.body = {
                code: 200,
                message: errMsg,
            };
            return;
        }

        //2. 调用渲染引擎
        const rst = await imgBot.render(tplName, args)

        //3. 保存图片
        await saveMiddleware(ctx, rst, save)
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: e.toString(),
        };
    }
}

module.exports = serve