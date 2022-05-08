# image-bot

这是一个基于[puppeteer](https://www.npmjs.com/package/puppeteer)实现的根据**图片模板**生成图片的项目，可以用于“为每个人生成一张专属海报”、“根据特定参数自动出图”等场景。

## 1.定义模板

> 图片模板是一个保存在`template`下、以`.tpl`结尾的子文件夹（如 `example.tpl`），其中包含一个用于定义模板变量的 js 文件`args.js`，和用于渲染图片的html 文件`index.html`；html 中允许使用 `args.js` 中定义的变量；变量的值在服务被调用时由业务方以接口参数的方式传入。`index.html`中可以使用相对路径来引用素材（如图片、字体）（相对于 index.html）。
> ![](assert/structure.png#pic_center)

- `args.js` 定义生成的图片大小、模板中的变量，文件结构如下:

```js
module.exports = {
  //页面设置，定义图片大小
  page: {
    width: 375,
    height: 667,
    isMobile: true,
  },

  //模板变量定义
  interface: {
    //参数名：avatar
    avatar: {
      type: String, //变量类型

      //变量默认值
      default:
        "https://thirdwx.qlogo.cn/mmopen/vi_32/M8IsoUHzXibQhmRsVM7RYHX9jp0e844yicKq1HJzOibEZuicBNcib34pccicX850K7MWia29KKvxmp83VrJLzn5kBeOGg/132",

      //参数检查的方法，在生成图片时传入的参数检查失败将导致调用失败
      checkFn: (arg) => {
        return /^https:\/\/.+/.test(arg);
      },

      //参数是否必传
      required: false,
    },
    //...
  },
};
```

- `index.html`，为提高安全性和图片渲染性能，我们禁止在模板html中使用js，模板html中的js代码将不会运行并且可能导致未知效果；模板正式上线前，请在浏览器上提前测试它的渲染速度。
- 示例模板：`template/example.tpl`

## 2.配置和图片保存方式

- 服务的配置在`config`目录，使用[config](https://github.com/node-config/node-config)组件实现，不同环境的配置参考：https://github.com/node-config/node-config/wiki/Environment-Variables

- 配置的含义：

```js
module.exports = {
  port: 8080, //服务监听端口

  //图片保存方式
  save: {
    type: "return",
  },

  puppeteer: {
    //图片使用Chrome/Chromium 渲染而成，下面是启动参数，具体文档参考：https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v13.7.0&show=api-puppeteerlaunchoptions
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

    //浏览器Tab池大小
    pool: {
      max: 50,
      min: 10,
    },
  },

  //图片配置：https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v13.7.0&show=api-pagescreenshotoptions
  image: {
    type: "jpeg",
    quality: 80,
  },
};
```

- 图片保存方式

  - return 支持通过调用接口返回图片
  - local 将图片保存在本地某个目录，需要指定一个路径
    ```js
    //...
    save: {
        type: "local",
        basePath: "/opt/"
    },
    //...
    ```
    - 调用服务时，可以制定图片保存的子路径，**如果路径已经存在图片保存会失败**；
    - 如果没有制定保存路径，将使用`uuid.v4`生成一个文件名来保存文件；
  - ali-oss 将图片上传到阿里云 OSS 服务，需要提供 OSS 的相关配置：

    ```js
    //...
    save: {
        type: "ali-oss",
        // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou
        region: 'oss-cn-chengdu',
        // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户
        accessKeyId: 'xxxx',
        accessKeySecret: 'yyyyyy',
        // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket
        bucket: 'zzzzz',

        //路径前缀
        prefix: "generated-image/"
    },
    //...
    ```

  - 更多图片保存方式
    图片保存，采用**外观模式**，只需要在`lib/save`目录下实现一种保存方式就可以了，代码结构参考源码。

## 3.调用接口完成图片生成
- 接口调用方法： POST
- 接口调用路径： /call
- 使用json传参：
```js
{
    //模板名称
    "tplName": "example", 
    //图片模板参数，需要哪些参数，参数的格式由模板变量定义文件`args.js`决定
    "args": {
        "username": "朱元璋"
    },
    "save":"my-test" //图片保存参数，可以在保存方式的代码中重新定义
}
```
- 注意： 为了安全性，参数中的 `&, <, ', "` 字符会被转义