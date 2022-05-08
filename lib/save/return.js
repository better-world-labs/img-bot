const config = require('config');

module.exports = saveConfig => {
    //处理配置
    return async (ctx, imageBuffer, saveArgs) => {
        //处理文件保存
        ctx.body = imageBuffer;
        ctx.type = config.image.type;
    };
}