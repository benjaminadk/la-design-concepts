#!/usr/bin/env node

const program = require("commander")
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default
const sgMail = require("@sendgrid/mail")
const Klaviyo = require("node-klaviyo")

const WooCommerce = new WooCommerceRestApi({
  url: "https://ladesignconcepts.com",
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: "wc/v3",
})

sgMail.setApiKey(process.env.SENDGRID_KEY)

const KlaviyoClient = new Klaviyo({
  publicToken: process.env.KLAVIYO_PUBLIC_KEY,
  privateToken: process.env.KLAVIYO_PRIVATE_KEY,
})

program
  .option("-o, --order <number>", "Order number to process")
  .option("-u, --user <name>", "Name of salesperson sending emails", "chris")
  .option("-k, --klaviyo", "Skip Klaviyo Flow", false)
  .option("-t, --test", "Enable test mode", false)

  .parse(process.argv)

const BRANDS = [
  {
    name: "Schumacher",
    samples: [],
    to: { name: " Morgan", email: "mshepard@fsco.com" },
  },
  {
    name: "Galbraith",
    samples: [],
    to: { name: " Fyfe", email: "samples@thomaslavin.com" },
  },
  {
    name: "Christopher Farr",
    samples: [],
    to: { name: " Fyfe", email: "samples@thomaslavin.com" },
  },
  {
    name: "Opuzen",
    samples: [],
    to: { name: " Fyfe", email: "samples@thomaslavin.com" },
  },
  {
    name: "Calvin",
    samples: [],
    to: { name: " Fyfe", email: "samples@thomaslavin.com" },
  },
  {
    name: "Scalamandre",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Nicolette Mayer",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },

  {
    name: "Old World Weavers",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Lelievre",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Christian Fischbacher",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Aldeco",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Sandberg",
    samples: [],
    to: { name: " Becky", email: "bmcreynolds@scalamandre.com" },
  },
  {
    name: "Peter Dunham",
    samples: [],
    to: { name: " Sean", email: "sean@peterdunhamtextiles.com" },
  },
  {
    name: "Ralph Lauren",
    samples: [],
    to: { name: "", email: "CustomerService@folia-fabrics.com" },
  },
  {
    name: "Robert Allen",
    samples: [],
    to: { name: "", email: "orderscs@tradgroup.com" },
  },
  {
    name: "Suburban Home",
    samples: [],
    to: { name: "", email: "orderscs@tradgroup.com" },
  },
  {
    name: "Duralee",
    samples: [],
    to: { name: "", email: "orderscs@tradgroup.com" },
  },
  {
    name: "Highland Court",
    samples: [],
    to: { name: "", email: "orderscs@tradgroup.com" },
  },
  {
    name: "Beacon Hill",
    samples: [],
    to: { name: "", email: "orderscs@tradgroup.com" },
  },
  {
    name: "Jasper",
    samples: [],
    to: {
      name: "Katia",
      email: ["Sample@jaspershowroom.com", "Kathalene.Barton@jaspershowroom.com"],
    },
  },
  {
    name: "Seabrook",
    samples: [],
    to: {
      name: "",
      email: "samples@wallquest.com",
    },
  },
  {
    name: "AST",
    samples: [],
    to: { name: "", email: "samples@designalliancela.com" },
  },
  {
    name: "Wallcoveting",
    samples: [],
    to: { name: "Brenda", email: "brenda@brendahouston.com" },
  },
  {
    name: "Maxwell",
    samples: [],
    to: { name: "", email: "memo@maxwellfabrics.com" },
  },
  {
    name: "Telefina",
    samples: [],
    to: { name: "", email: "memo@maxwellfabrics.com" },
  },
  {
    name: "Kasmir",
    samples: [],
    to: { name: "", email: "service@kasmirfabrics.com" },
  },
]

const THOMAS_LAVIN = ["Galbraith", "Christopher Farr"]

async function main() {
  const { order, user, klaviyo: skipKlaviyo, test } = program

  if (!order) {
    return console.error("Error:\nOrder number required. Use -o <order number> option")
  }

  const from = {}
  if (user === "ben") {
    from.name = "Benjamin Brooke"
    from.nickname = "Ben"
    from.email = "ben@ladesignconcepts.com"
  } else if (user == "chris") {
    from.name = "Chris Soliz"
    from.nickname = "Chris"
    from.email = "chris@ladesignconcepts.com"
  } else {
    from.name = "L.A. Design Concepts Samples Team"
    from.nickname = "L.A. Design Concepts"
    from.email = "samples@ladesignconcepts.com"
  }

  try {
    const res = await WooCommerce.get(`orders/${order}`)
    const { first_name, last_name, address_1, address_2, city, state, postcode } = res.data.shipping
    const items = res.data.line_items

    for (let item of items) {
      if (item.name === "Sample") {
        let name = item.meta_data.find((el) => el.key === "Name")["value"]
        let sku = item.meta_data.find((el) => el.key === "SKU")["value"]

        for (let brand of BRANDS) {
          if (name.startsWith(brand.name)) {
            var display_name, display_sku

            if (brand.name === "Galbraith") {
              let x = sku.slice(sku.indexOf("-") + 1)
              display_name = `${name} ${Number(x) > 245 ? "Wallpaper" : "Fabric"}`
              display_sku = ""
            } else if (brand.name === "Robert Allen" || brand.name === "Christopher Farr") {
              display_name = name
              display_sku = ""
            } else if (brand.name === "Schumacher") {
              display_name = name
              display_sku = sku.slice(sku.indexOf("-") + 1).replace("a", "").replace("-2", "")
            } else {
              display_name = name
              display_sku = sku.slice(sku.indexOf("-") + 1)
            }

            brand.samples.push(`${display_name} ${display_sku}`)
          }
        }
      }
    }

    // Consolidate Scalamandre, Nicolette Mayer, Old World Weaveres, Lelievre
    var a1 = BRANDS.find((el) => el.name === "Scalamandre")["samples"]
    var a2 = BRANDS.find((el) => el.name === "Nicolette Mayer")["samples"]
    var a3 = BRANDS.find((el) => el.name === "Old World Weavers")["samples"]
    var a4 = BRANDS.find((el) => el.name === "Lelievre")["samples"]
    var a5 = BRANDS.find((el) => el.name === "Christian Fischbacher")["samples"]
    var a6 = BRANDS.find((el) => el.name === "Aldeco")["samples"]
    var a7 = BRANDS.find((el) => el.name === "Sandberg")["samples"]

    BRANDS.find((el) => el.name === "Scalamandre")["samples"] = [
      ...a1,
      ...a2,
      ...a3,
      ...a4,
      ...a5,
      ...a6,
      ...a7,
    ]
    BRANDS.find((el) => el.name === "Nicolette Mayer")["samples"] = []
    BRANDS.find((el) => el.name === "Old World Weavers")["samples"] = []
    BRANDS.find((el) => el.name === "Lelievre")["samples"] = []
    BRANDS.find((el) => el.name === "Christian Fischbacher")["samples"] = []
    BRANDS.find((el) => el.name === "Aldeco")["samples"] = []
    BRANDS.find((el) => el.name === "Sandberg")["samples"] = []

    // Consolidate Robert Allen, Suburban Home
    var b1 = BRANDS.find((el) => el.name === "Robert Allen")["samples"]
    var b2 = BRANDS.find((el) => el.name === "Suburban Home")["samples"]
    var b3 = BRANDS.find((el) => el.name === "Duralee")["samples"]
    var b4 = BRANDS.find((el) => el.name === "Highland Court")["samples"]
    var b5 = BRANDS.find((el) => el.name === "Beacon Hill")["samples"]

    BRANDS.find((el) => el.name === "Robert Allen")["samples"] = [...b1, ...b2, ...b3, ...b4, ...b5]
    BRANDS.find((el) => el.name === "Suburban Home")["samples"] = []
    BRANDS.find((el) => el.name === "Duralee")["samples"] = []
    BRANDS.find((el) => el.name === "Highland Court")["samples"] = []
    BRANDS.find((el) => el.name === "Beacon Hill")["samples"] = []

    // Consolidate Christopher Farr, Galbraith
    var c1 = BRANDS.find((el) => el.name === "Galbraith")["samples"]
    var c2 = BRANDS.find((el) => el.name === "Christopher Farr")["samples"]
    var c3 = BRANDS.find((el) => el.name === "Opuzen")["samples"]
    var c4 = BRANDS.find((el) => el.name === "Calvin")["samples"]

    BRANDS.find((el) => el.name === "Galbraith")["samples"] = [...c1, ...c2, ...c3, ...c4]
    BRANDS.find((el) => el.name === "Christopher Farr")["samples"] = []
    BRANDS.find((el) => el.name === "Opuzen")["samples"] = []
    BRANDS.find((el) => el.name === "Calvin")["samples"] = []

    // Consolidate Maxwell, Telefina
    var d1 = BRANDS.find((el) => el.name === "Maxwell")["samples"]
    var d2 = BRANDS.find((el) => el.name === "Telefina")["samples"]

    BRANDS.find((el) => el.name === "Maxwell")["samples"] = [...d1, ...d2]
    BRANDS.find((el) => el.name === "Telefina")["samples"] = []


    for (let brand of BRANDS) {
      if (brand.samples.length) {
        var text = `Hello${brand.to.name},\n\nCan we please have the following samples sent to the address below?\n\n`

        for (let sample of brand.samples) {
          text += `${sample}\n\n`
        }

        text += `${first_name} ${last_name}\n${address_1} ${address_2}\n${city}, ${state} ${postcode}\n\n`

        text += `Thanks,\n\n${from.nickname}\n\n${from.name}\nL.A. Design Concepts\n${from.email}\n`

        var subject =
          brand.name === "Ralph Lauren"
            ? `Account 01020524 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Seabrook"
            ? `654535 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Kasmir" ? `234728 - Sample Request - ${order} Client - ${last_name}` : `Sample Request - ${order} Client - ${last_name}`

        var console_brand = THOMAS_LAVIN.includes(brand.name) ? "Thomas Lavin" : brand.name

        let message = {
          to: brand.to.email,
          cc: from.email,
          from: from.email,
          subject,
          text,
        }

        if (test) {
          console.log(`TEST MODE To: ${brand.to.email} Brand: ${console_brand}`)
          console.log(subject)
          console.log(text)
        } else {
          await sgMail.send(message)
          console.log(`Email sent! To: ${brand.to.email} Brand: ${console_brand}`)
        }
      }
    }

    if (skipKlaviyo || test) {
      // Do nothing
    } else {
      KlaviyoClient.public.track({
        event: "Sample Order",
        email: res.data.billing.email,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

main()
