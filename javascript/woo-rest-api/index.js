require("dotenv").config()
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default

const WooCommerce = new WooCommerceRestApi({
  url: "https://ladc:ladc@dev.ladesignconcepts.com",
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: "wc/v3",
  queryStringAuth: true,
})

async function main() {
  try {
    const res = await WooCommerce.get(`orders/803352`)
    console.log(res.data.line_items[1].meta_data)
  } catch (error) {
    console.log(error)
  }
}

main()
