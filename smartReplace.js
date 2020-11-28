//https://github.com/sazs34/MyActions

const download = require("download");
async function replaceWithSecrets(content, Secrets) {
    if (!Secrets || !Secrets) return content;
    const replacements = [];
    await init_notify(Secrets, content, replacements);
        if (Secrets.COOKIE_QQYD) {
            replacements.push({ key: "$.getdata(qqreadurlKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[0]) });
            replacements.push({ key: "$.getdata(qqreadheaderKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[1]) });
            replacements.push({ key: "$.getdata(qqreadtimeurlKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[2]) });
            replacements.push({ key: "$.getdata(qqreadtimeheaderKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[3]) });
        }
        await downloader(content);//检查所需额外js
    /*
        if (Secrets.MarketCoinToBeanCount && !isNaN(Secrets.MarketCoinToBeanCount)) {
            let coinToBeanCount = parseInt(Secrets.MarketCoinToBeanCount);
            if (coinToBeanCount >= 0 && coinToBeanCount <= 20 && content.indexOf("$.getdata('coinToBeans')") > 0) {
                console.log("蓝币兑换京豆操作已注入");
                replacements.push({ key: "$.getdata('coinToBeans')", value: coinToBeanCount });
            }
        }
     */
    return batchReplace(content, replacements);
}
function batchReplace(content, replacements) {
    for (var i = 0; i < replacements.length; i++) {
        content = content.replace(replacements[i].key, replacements[i].value);
    }
    return content;
}

async function init_notify(Secrets, content, replacements) {
    if (!Secrets.PUSH_KEY && !Secrets.BARK_PUSH && !Secrets.TG_BOT_TOKEN) {
        if (content.indexOf("require('./sendNotify')") > 0) {
            replacements.push({
                key: "require('./sendNotify')",
                value:
                    "{sendNotify:function(){},serverNotify:function(){},BarkNotify:function(){},tgBotNotify:function(){}}",
            });
        }
    }
}
async function downloader(content) {
    if (content.indexOf("jdFruitShareCodes") > 0) {
        await download_jdFruit();
    }
}

async function download_notify() {
    await download("https://github.com/lxk0301/jd_scripts/raw/master/sendNotify.js", "./", {
        filename: "sendNotify.js",
    });
    console.log("下载通知代码完毕");
}

module.exports = {
    replaceWithSecrets,
};
