const data = require("./data/01-商品页(点菜)")
const data1 = require("./data/02-商品页(评价)")
const data2 = require("./data/03-商品页(商家)")

const goods = data
const ratings = data1
const seller = data2

module.exports = {
    configureWebpack: {
        devServer: {
            before(app) {
                app.get("/api/goods", function (req, res) {
                    res.json({
                        data: goods
                    })
                })
                app.get("/api/ratings", function (req, res) {
                    res.json({
                        data: ratings
                    })
                })
                app.get("/api/seller", function (req, res) {
                    res.json({
                        data: seller
                    })
                })
            },
            proxy:{
                "/git":{
                    target:"https://api.github.com/",
                    changeOrigin:true,
                    pathRewrite:{"^/git":""}
                }
            }
        }
    }
}