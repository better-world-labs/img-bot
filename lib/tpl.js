const path = require('path');
const fs = require("fs");
const is = require('is-type-of');
const escape = require("html-escape");

const map = new Map();

function getTplContentByName(tplName) {
    let tpl = map.get(tplName)
    if (!tpl) {
        tpl = fs.readFileSync(path.resolve(__dirname, `../template/${tplName}.tpl/index.html`), "utf8");
        tpl = `<base href="file://${path.resolve(__dirname, `../template/${tplName}.tpl`)}/">\n` + tpl;
        map.set(tplName, tpl);
    }
    return tpl;
}

function genHtml(tplName, args) {
    const tplContent = getTplContentByName(tplName);
    return tplContent.replace(/\$\{([a-z_][a-z_0-9]*)\}/ig, (arg, argName) => {
        return args[argName];
    });
}

function getPageSettings(tplName) {
    return loadTplArgsSetting(tplName).page || {};
}

function checkArgs(tplName, args) {
    const argsDefine = loadTplArgsSetting(tplName).interface || {};
    const keys = Object.keys(argsDefine);

    for (let k of keys) {
        const define = argsDefine[k];
        if (!args[k] && define.default) {
            args[k] = define.default;
        }
        args[k] = define.type(args[k]);

        if (is.function(define.checkFn)) {
            if (!define.checkFn(args[k])) {
                return `the arg(${k}) check failed`;
            }
        }

        if (define.required && !args[k]) {
            return `the arg(${k}) is required`
        }

        if (is.string(args[k])) {
            args[k] = escape(args[k]);
        }
    }
}

function loadTplArgsSetting(tplName) {
    const filepath = path.join('../', 'template', `${tplName}.tpl`, 'args.js');
    return require(filepath);
}

module.exports = {
    genHtml,
    getPageSettings,
    checkArgs,
};