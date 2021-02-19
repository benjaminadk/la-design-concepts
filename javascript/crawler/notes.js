const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default
const parse = require("parse-link-header")
const fs = require("fs")

const url = "https://ladesignconcepts.com"
const writer = fs.createWriteStream("notes.csv")

const WooCommerce = new WooCommerceRestApi({
  url,
  consumerKey: "ck_a07ed2e4e5d45277a99dcc28a7cbd6f9bffb0713",
  consumerSecret: "cs_7d38fc1eb45b26b1427d1d91dbf61234474c0472",
  version: "wc/v3",
})

async function main() {
  const res = await WooCommerce.get("orders/1038490/notes", {
    per_page: 10,
    page: 1,
    status: "completed",
  })

  console.log(res.data)
}

main()