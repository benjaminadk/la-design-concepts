require('dotenv').config()
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default

const Dev = new WooCommerceRestApi({
  url: 'https://ladc:ladc@dev.ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY_DEV,
  consumerSecret: process.env.WOOCOMMERCE_SECRET_DEV,
  version: 'wc/v3',
  queryStringAuth: true,
})

const Live = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

async function main() {
  try {
    const res = await Dev.get(`orders/803442 `)
    console.log(JSON.stringify(res.data, null, 4))
  } catch (error) {
    console.log(error)
  }
}

main()
