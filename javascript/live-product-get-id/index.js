require("dotenv").config()
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default
const { createWriteStream } = require("fs")
const SKUS = require("./skus.js")

const API = new WooCommerceRestApi({
  url: "https://ladesignconcepts.com",
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: "wc/v3",
})

async function main() {
  try {
    const writer1 = createWriteStream("pinterest.csv")
    const writer2 = createWriteStream("pinterest-discos.csv")
    writer1.write(`sku,id,sale_price,regular_price\n`)
    writer2.write(`sku,post_status\n`)

    for (let sku of SKUS) {
      const res = await API.get(`products/`, {
        sku,
      })
      if (res.data.length > 0) {
        let { id, sale_price, regular_price } = res.data[0]
        writer1.write(`${sku},${id},${sale_price},${regular_price}\n`)
      } else {
        writer2.write(`${sku},trash\n`)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

main()
