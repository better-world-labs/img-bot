// 处理图片渲染，将直接路径的html渲染成图片
const config = require('config');
const puppeteer = require('puppeteer');
const genericPool = require("generic-pool");
const Tpl = require('./tpl');
const path = require('path');

let browserPromise
async function getbrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch(config.puppeteer.launch);
    }
    return await browserPromise;
}


const factory = {
    async create() {
        const browser = await getbrowser();
        const pages = await browser.pages();
        let page
        if (pages.length == 1 && Pool.size == 1) {
            page = pages[0];
        } else {
            page = await browser.newPage();
        }
        page.setJavaScriptEnabled(false);
        await page.goto(`file://${path.resolve(__dirname, `../assert/index.html`)}`)
        return page;
    },
    async destroy(page) {
        return await page.close();
    },
};

const Pool = genericPool.createPool(factory, config.puppeteer.pool)

async function render(tplName, args) {
    const page = await Pool.acquire();

    //替换模板变量
    const html = Tpl.genHtml(tplName, args);
    const pageSettings = Tpl.getPageSettings(tplName);

    //渲染图片
    try {
        await page.setViewport({
            width: pageSettings.width,
            height: pageSettings.height,
            isMobile: pageSettings.isMobile
        });
        await page.setContent(html);

        return await page.screenshot({
            type: pageSettings.imageType || config.image.type,
            quality: pageSettings.quality || config.image.quality,
            fullPage: true
        });
    }
    finally {
        Pool.release(page);
    }
}

exports.render = render;