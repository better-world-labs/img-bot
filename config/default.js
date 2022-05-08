module.exports = {
    port: 8080,

    save: {
        type: "return",
    },

    // save: {
    //     type: "local",
    //     basePath: "/opt/"
    // },

    // save: {
    //     type: "ali-oss",

    //     region: 'oss-cn-chengdu',
    //     // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    //     accessKeyId: 'xxxx',
    //     accessKeySecret: 'yyyyyy',
    //     // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
    //     bucket: 'zzzzz',

    //     //路径前缀
    //     prefix: "generated-image/"
    // },

    puppeteer: {
        launch: {
            args: [
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-first-run",
                "--no-sandbox",
                "--no-zygote",
                "--single-process",
                "--disable-extensions",
                "--disable-xss-auditor",
                "--disable-popup-blocking",
                "--disable-accelerated-2d-canvas",
            ],
            headless: true,
        },

        pool: {
            max: 50,
            min: 10,
        },
    },

    image: {
        type: "jpeg",
        quality: 80,
    },
}