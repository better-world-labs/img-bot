const OSS = require('ali-oss');
const path = require("path");
const uuid = require('uuid');
const config = require('config');


module.exports = saveConfig => {
    const client = new OSS({
        // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region: saveConfig.region,
        // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
        accessKeyId: saveConfig.accessKeyId,
        accessKeySecret: saveConfig.accessKeySecret,
        // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
        bucket: saveConfig.bucket,
    });

    return async (ctx, imageBuffer, saveArgs) => {
        if (!saveArgs) {
            saveArgs = uuid.v4() + '.' + config.image.type;
        }

        const ossFilePath = saveConfig.prefix + saveArgs;

        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        const result = await client.put(ossFilePath, imageBuffer);
        ctx.body = {
            code: 200,
            path: result.url,
            url: result.url,
        };
    };
}