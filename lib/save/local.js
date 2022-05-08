const { open } = require('fs/promises');
const path = require('path');
const uuid = require('uuid');
const config = require('config');

/**
 * 
 * @param {*} saveConfig 当前保存方式的配置
 * @returns 
 */
module.exports = saveConfig => {
    //处理配置
    return async (ctx, imageBuffer, saveArgs) => {
        let filehandle;
        try {
            if (!saveArgs) {
                saveArgs = uuid.v4() + '.' + config.image.type;
            }
            filehandle = await open(path.resolve(saveConfig.basePath, saveArgs), 'ax');
            await filehandle.write(imageBuffer);
            ctx.body = {
                code: 200,
                path: saveArgs,
            };
        }
        finally {
            await filehandle?.close();
        }
    };
}