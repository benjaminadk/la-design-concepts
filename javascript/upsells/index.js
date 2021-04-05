require("dotenv").config()
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default
const data = require("./data")

const WooCommerce = new WooCommerceRestApi({
  url: "https://ladesignconcepts.com",
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: "wc/v3",
})

const temp = {}

async function main() {
  for (let [i, x] of data.slice(1, 20).entries()) {
    const { id, name } = x
    if (temp[name]) {
      temp[name].push(id)
    } else {
      temp[name] = [id]
    }
  }

  const upsells = data.slice(1, 20).map((x) => {
    const upsell_ids = temp[x.name] ? temp[x.name].filter((y) => y !== x.id) : []
    return { id: x.id, upsell_ids }
  })

  try {
    for (let up of upsells) {
      const res = await WooCommerce.put(`products/${up.id}`, {
        upsell_ids: up.upsell_ids,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

main()
