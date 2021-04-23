require('dotenv').config()
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const parse = require('parse-link-header')
const fs = require('fs')

const url = 'https://ladesignconcepts.com'
const writer = fs.createWriteStream('furniture.csv')
writer.write('id,sku,link,name,price,manufacturer,image\n')

const WooCommerce = new WooCommerceRestApi({
  url,
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

async function main() {
  var page = 1

  const res = await WooCommerce.get('products', {
    per_page: 100,
    page,
    category: '472',
    status: 'publish',
    min_price: '1',
  })

  var parsed = parse(res.headers.link)

  while (parsed.next) {
    const res2 = await WooCommerce.get('products', {
      per_page: 100,
      page,
      category: '472',
      status: 'publish',
      min_price: '1',
    })

    for (let d of res2.data) {
      try {
        const attr = d.attributes
        const cat = d.categories

        const img1 = attr.find((el) => el.name === 'product_images')
        const img = img1 ? img1.options[0] : ''

        const manf1 = attr.find((el) => el.name === 'manufacturer')
        const manf = manf1 ? manf1.options[0] : ''

        console.log(`writing ${d.name}`)

        writer.write(
          `${d.id},${d.sku},${d.slug},"${d.name}",${d.price},"${manf}","${img}"\n`
        )
      } catch (error) {
        console.log(`Error`)
      }
    }

    parsed = parse(res2.headers.link)
    page += 1
  }
}

main()
