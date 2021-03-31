const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default
const parse = require("parse-link-header")
const fs = require("fs")

const url = "https://ladesignconcepts.com"
const writer = fs.createWriteStream("data.csv")
writer.write(
  "id,sku,name,link,price,regular_price,image,pattern_name,pattern_number,color,manufacturer,brand,collection,category\n"
)

const WooCommerce = new WooCommerceRestApi({
  url,
  consumerKey: process.env.KEY,
  consumerSecret: process.env.SECRET,
  version: "wc/v3",
})

async function main() {
  var page = 1

  const res = await WooCommerce.get("products", {
    per_page: 100,
    page,
    status: "publish"
  })

  var parsed = parse(res.headers.link)

  while (parsed.next) {
    const res2 = await WooCommerce.get("products", {
      per_page: 100,
      page,
      status: "publish"
    })

    for (let d of res2.data) {
      try {
        const attr = d.attributes
        const cat = d.categories
        const img1 = attr.find((el) => el.name === "product_images")
        const img = img1 ? img1.options[0] : ""

        const pattern_name1 = attr.find((el) => el.name === "pattern_name")
        const pattern_name = pattern_name1 ? pattern_name1.options[0] : ""

        const pattern_number1 = attr.find((el) => el.name === "pattern_number")
        const pattern_number = pattern_name1 ? pattern_number1.options[0] : ""

        const color1 = attr.find((el) => el.name === "color")
        const color = color1 ? color1.options[0] : ""

        const manf1 = attr.find((el) => el.name === "manufacturer")
        const manf = manf1 ? manf1.options[0] : ""

        const brand1 = attr.find((el) => el.name === "brand")
        const brand = brand1 ? brand1.options[0] : ""

        const collection1 = attr.find((el) => el.name === "collection")
        const collection = collection1 ? collection1.options[0] : ""

        const content1 = attr.find((el) => el.name === "content")
        const content = content1 ? content1.options[0] : ""

        const isFabric = cat.findIndex((el) => el.slug === "fabric") !== -1
        const isWallpaper =
          cat.findIndex((el) => el.slug === "wallpaper") !== -1
        const category = isFabric ? "fabric" : isWallpaper ? "wallpaper" : ""

        console.log(`writing ${d.name}`)

        writer.write(
          `${d.id},${d.sku},"${d.name}",${d.slug},${d.price},${d.regular_price},${img},"${pattern_name}","${pattern_number}","${color}",${manf},"${brand}","${collection}","${category}"\n`
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
