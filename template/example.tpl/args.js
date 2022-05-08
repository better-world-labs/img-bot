module.exports = {
    page: {
        width: 375,
        height: 667,
        isMobile: true,
    },

    interface: {
        avatar: {
            type: String,
            default: "https://thirdwx.qlogo.cn/mmopen/vi_32/M8IsoUHzXibQhmRsVM7RYHX9jp0e844yicKq1HJzOibEZuicBNcib34pccicX850K7MWia29KKvxmp83VrJLzn5kBeOGg/132",
            checkFn: arg => {
                return /^https:\/\/.+/.test(arg)
            },
            required: false,
        },

        username: {
            type: String,
            default: "佐助",
        },

        // 捐赠积分
        donationPoints: {
            type: Number,
            default: 2000,
        },

        // 主体内容
        content: {
            type: String,
            default: "“众筹AED设备-东软学院”",
        },

        // 已收积分
        receivedPoints: {
            type: String,
            default: "666,77",
        },

        // 缺少积分
        lackPoints: {
            type: String,
            default: "123,123",
        },

        // 小程序码
        minicode: {
            type: String,
            default: "http://alicliimg.clewm.net/weapp/2018/05/08/3b01ab35390b6e1c793a25ef300941761525770920.png@80Q",
        },
    },
}