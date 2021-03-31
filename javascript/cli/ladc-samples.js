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

const BRANDS = require("./lib/samples-brands")
const THOMAS_LAVIN = [
  "Galbraith",
  "Christopher Farr",
  "Maya Romanoff",
  "Calvin",
  "Opuzen",
  "Castel Maison",
]

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
        if (
          item.meta_data[0].hasOwnProperty("key") &&
          item.meta_data[0]["key"].startsWith("Pierre Frey")
        ) {
          BRANDS.find((el) => el.name === "Pierre Frey")["samples"].push(
            `Pierre Frey ${item.meta_data[0]["display_value"]}`
          )
        } else if (
          item.meta_data[0].hasOwnProperty("key") &&
          item.meta_data[0]["key"].startsWith("Thibaut")
        ) {
          BRANDS.find((el) => el.name === "Thibaut")["samples"].push(
            `Thibaut ${item.meta_data[0]["display_value"]}`
          )
        } else if (
          item.meta_data[0].hasOwnProperty("key") &&
          item.meta_data[0]["key"].startsWith("Robert Allen")
        ) {
          BRANDS.find((el) => el.name === "Robert Allen")["samples"].push(
            `Robert Allen ${item.meta_data[0]["display_value"]}`
          )
        } else {
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
                display_sku = sku
                  .slice(sku.indexOf("-") + 1)
                  .replace("a", "")
                  .replace("-2", "")
              } else if (brand.name === "Cole") {
                display_name = name
                display_sku = sku.replace("_", "/")
              } else if (
                ["Osborne", "Designer", "Lorca", "Nina Campbell", "Matthew"].includes(brand.name)
              ) {
                display_name = ""
                display_sku = sku.slice(sku.indexOf("-") + 1).toUpperCase()
              } else {
                display_name = name
                display_sku = sku.slice(sku.indexOf("-") + 1)
              }

              brand.samples.push(`${display_name} ${display_sku}`)
            }
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
    var a8 = BRANDS.find((el) => el.name === "Jean Paul")["samples"]
    var a9 = BRANDS.find((el) => el.name === "Alhambra")["samples"]
    var a10 = BRANDS.find((el) => el.name === "Grey Watkins")["samples"]
    var a11 = BRANDS.find((el) => el.name === "Colony")["samples"]
    var a12 = BRANDS.find((el) => el.name === "Missoni Home")["samples"]
    var a13 = BRANDS.find((el) => el.name === "Boris Kroll")["samples"]
    var a14 = BRANDS.find((el) => el.name === "Tassinari")["samples"]

    BRANDS.find((el) => el.name === "Scalamandre")["samples"] = [
      ...a1,
      ...a2,
      ...a3,
      ...a4,
      ...a5,
      ...a6,
      ...a7,
      ...a8,
      ...a9,
      ...a10,
      ...a11,
      ...a12,
      ...a13,
      ...a14,
    ]
    BRANDS.find((el) => el.name === "Nicolette Mayer")["samples"] = []
    BRANDS.find((el) => el.name === "Old World Weavers")["samples"] = []
    BRANDS.find((el) => el.name === "Lelievre")["samples"] = []
    BRANDS.find((el) => el.name === "Christian Fischbacher")["samples"] = []
    BRANDS.find((el) => el.name === "Aldeco")["samples"] = []
    BRANDS.find((el) => el.name === "Sandberg")["samples"] = []
    BRANDS.find((el) => el.name === "Jean Paul")["samples"] = []
    BRANDS.find((el) => el.name === "Alhambra")["samples"] = []
    BRANDS.find((el) => el.name === "Grey Watkins")["samples"] = []
    BRANDS.find((el) => el.name === "Colony")["samples"] = []
    BRANDS.find((el) => el.name === "Missoni Home")["samples"] = []
    BRANDS.find((el) => el.name === "Boris Kroll")["samples"] = []
    BRANDS.find((el) => el.name === "Tassinari")["samples"] = []

    // Consolidate Robert Allen, Suburban Home
    var b1 = BRANDS.find((el) => el.name === "Robert Allen")["samples"]
    var b2 = BRANDS.find((el) => el.name === "Suburban Home")["samples"]
    var b3 = BRANDS.find((el) => el.name === "Duralee")["samples"]
    var b4 = BRANDS.find((el) => el.name === "Highland Court")["samples"]
    var b5 = BRANDS.find((el) => el.name === "Beacon Hill")["samples"]
    var b6 = BRANDS.find((el) => el.name === "Bailey")["samples"]

    BRANDS.find((el) => el.name === "Robert Allen")["samples"] = [
      ...b1,
      ...b2,
      ...b3,
      ...b4,
      ...b5,
      ...b6,
    ]
    BRANDS.find((el) => el.name === "Suburban Home")["samples"] = []
    BRANDS.find((el) => el.name === "Duralee")["samples"] = []
    BRANDS.find((el) => el.name === "Highland Court")["samples"] = []
    BRANDS.find((el) => el.name === "Beacon Hill")["samples"] = []
    BRANDS.find((el) => el.name === "Bailey")["samples"] = []

    // Consolidate Christopher Farr, Galbraith
    var c1 = BRANDS.find((el) => el.name === "Galbraith")["samples"]
    var c2 = BRANDS.find((el) => el.name === "Christopher Farr")["samples"]
    var c3 = BRANDS.find((el) => el.name === "Opuzen")["samples"]
    var c4 = BRANDS.find((el) => el.name === "Calvin")["samples"]
    var c5 = BRANDS.find((el) => el.name === "Maya Romanoff")["samples"]
    var c6 = BRANDS.find((el) => el.name === "Castel Maison")["samples"]

    BRANDS.find((el) => el.name === "Galbraith")["samples"] = [
      ...c1,
      ...c2,
      ...c3,
      ...c4,
      ...c5,
      ...c6,
    ]
    BRANDS.find((el) => el.name === "Christopher Farr")["samples"] = []
    BRANDS.find((el) => el.name === "Opuzen")["samples"] = []
    BRANDS.find((el) => el.name === "Calvin")["samples"] = []
    BRANDS.find((el) => el.name === "Maya Romanoff")["samples"] = []
    BRANDS.find((el) => el.name === "Castel Maison")["samples"] = []

    // Consolidate Maxwell, Telefina
    var d1 = BRANDS.find((el) => el.name === "Maxwell")["samples"]
    var d2 = BRANDS.find((el) => el.name === "Telefina")["samples"]

    BRANDS.find((el) => el.name === "Maxwell")["samples"] = [...d1, ...d2]
    BRANDS.find((el) => el.name === "Telefina")["samples"] = []

    // Consolidate Jasper Brands
    var e1 = BRANDS.find((el) => el.name === "Jasper")["samples"]
    var e2 = BRANDS.find((el) => el.name === "Templeton")["samples"]

    BRANDS.find((el) => el.name === "Jasper")["samples"] = [...e1, ...e2]
    BRANDS.find((el) => el.name === "Templeton")["samples"] = []

    // Consolidate Kravet Brands
    var f1 = BRANDS.find((el) => el.name === "Kravet")["samples"]
    var f2 = BRANDS.find((el) => el.name === "Brunschwig")["samples"]
    var f3 = BRANDS.find((el) => el.name === "Lee Jofa")["samples"]
    var f4 = BRANDS.find((el) => el.name === "GP")["samples"]
    var f5 = BRANDS.find((el) => el.name === "Clarke")["samples"]
    var f6 = BRANDS.find((el) => el.name === "Groundworks")["samples"]
    var f7 = BRANDS.find((el) => el.name === "Winfield")["samples"]
    var f8 = BRANDS.find((el) => el.name === "Andrew Martin")["samples"]
    var f9 = BRANDS.find((el) => el.name === "Cole")["samples"]
    var f10 = BRANDS.find((el) => el.name === "Threads")["samples"]
    var f11 = BRANDS.find((el) => el.name === "Baker Lifestyle")["samples"]
    var f12 = BRANDS.find((el) => el.name === "Mulberry")["samples"]
    var f13 = BRANDS.find((el) => el.name === "Gaston")["samples"]
    var f14 = BRANDS.find((el) => el.name === "Laura Ashley")["samples"]
    var f15 = BRANDS.find((el) => el.name === "Parkertex")["samples"]

    BRANDS.find((el) => el.name === "Kravet")["samples"] = [
      ...f1,
      ...f2,
      ...f3,
      ...f4,
      ...f5,
      ...f6,
      ...f7,
      ...f8,
      ...f9,
      ...f10,
      ...f11,
      ...f12,
      ...f13,
      ...f14,
      ...f15,
    ]

    BRANDS.find((el) => el.name === "Brunschwig")["samples"] = []
    BRANDS.find((el) => el.name === "Lee Jofa")["samples"] = []
    BRANDS.find((el) => el.name === "GP")["samples"] = []
    BRANDS.find((el) => el.name === "Clarke")["samples"] = []
    BRANDS.find((el) => el.name === "Groundworks")["samples"] = []
    BRANDS.find((el) => el.name === "Winfield")["samples"] = []
    BRANDS.find((el) => el.name === "Andrew Martin")["samples"] = []
    BRANDS.find((el) => el.name === "Cole")["samples"] = []
    BRANDS.find((el) => el.name === "Threads")["samples"] = []
    BRANDS.find((el) => el.name === "Baker Lifestyle")["samples"] = []
    BRANDS.find((el) => el.name === "Mulberry")["samples"] = []
    BRANDS.find((el) => el.name === "Gaston")["samples"] = []
    BRANDS.find((el) => el.name === "Laura Ashley")["samples"] = []
    BRANDS.find((el) => el.name === "Parkertex")["samples"] = []

    // Consolidate Osborne & Little Brands
    var g1 = BRANDS.find((el) => el.name === "Osborne")["samples"]
    var g2 = BRANDS.find((el) => el.name === "Designer")["samples"]
    var g3 = BRANDS.find((el) => el.name === "Nina Campbell")["samples"]
    var g4 = BRANDS.find((el) => el.name === "Matthew")["samples"]
    var g5 = BRANDS.find((el) => el.name === "Lorca")["samples"]

    BRANDS.find((el) => el.name === "Osborne")["samples"] = [...g1, ...g2, ...g3, ...g4, ...g5]
    BRANDS.find((el) => el.name === "Designer")["samples"] = []
    BRANDS.find((el) => el.name === "Nina Campbell")["samples"] = []
    BRANDS.find((el) => el.name === "Matthew")["samples"] = []
    BRANDS.find((el) => el.name === "Lorca")["samples"] = []

    // Consolidate Wallcoveting
    var h1 = BRANDS.find((el) => el.name === "Wallcoveting")["samples"]
    var h2 = BRANDS.find((el) => el.name === "Brenda Houston")["samples"]

    BRANDS.find((el) => el.name === "Wallcoveting")["samples"] = [...h1, ...h2]
    BRANDS.find((el) => el.name === "Brenda Houston")["samples"] = []

    // Consolidate Fabricut
    var i1 = BRANDS.find((el) => el.name === "Fabricut")["samples"]
    var i2 = BRANDS.find((el) => el.name === "Trend")["samples"]
    var i3 = BRANDS.find((el) => el.name === "Vervain")["samples"]
    var i4 = BRANDS.find((el) => el.name === "S. Harris")["samples"]
    var i5 = BRANDS.find((el) => el.name === "Stroheim")["samples"]

    BRANDS.find((el) => el.name === "Fabricut")["samples"] = [...i1, ...i2, ...i3, ...i4, ...i5]
    BRANDS.find((el) => el.name === "Trend")["samples"] = []
    BRANDS.find((el) => el.name === "Vervain")["samples"] = []
    BRANDS.find((el) => el.name === "S. Harris")["samples"] = []
    BRANDS.find((el) => el.name === "Stroheim")["samples"] = []

    for (let brand of BRANDS) {
      if (brand.samples.length) {
        var html = `<p>Hello${brand.to.name},</p><p>Can we please have the following samples sent to the address below?</p>`
        var text = `Hello${brand.to.name},\n\nCan we please have the following samples sent to the address below?\n\n`

        for (let sample of brand.samples) {
          html += `<p>${sample}</p>`
          text += `${sample}\n\n`
        }

        html += `<br/><span>${first_name} ${last_name}</span><br/><span>${address_1} ${address_2}</span><br/><span>${city}, ${state} ${postcode}</span>`
        text += `${first_name} ${last_name}\n${address_1} ${address_2}\n${city}, ${state} ${postcode}\n\n`

        html += `<br/><p style="font-size:1.1rem;font-weight:bold;">Please include sidemark: ${order} on paperwork with samples.</p>`
        text += `Please include sidemark: ${order} on paperwork with samples.\n\n`

        html += `<p>Thanks,</p><p>${from.nickname}</p><br/><span>${from.name}</span><br/><span>L.A. Design Concepts</span><br/><span>${from.email}</span>`
        text += `Thanks,\n\n${from.nickname}\n\n${from.name}\nL.A. Design Concepts\n${from.email}\n`

        var subject =
          brand.name === "Ralph Lauren"
            ? `Account 01020524 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Seabrook"
            ? `654535 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Kasmir"
            ? `234728 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "JF"
            ? `Account U36971 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Osborne"
            ? `L.A. Design Concepts - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Fabricut"
            ? `Account 3037992 - Sample Request - ${order} Client - ${last_name}`
            : brand.name === "Victoria"
            ? `000987 - Sample Request - ${order} Client - ${last_name}`
            : `Sample Request - ${order} Client - ${last_name}`

        var console_brand = THOMAS_LAVIN.includes(brand.name) ? "Thomas Lavin" : brand.name

        let message = {
          to: brand.to.email,
          cc: from.email,
          from: from.email,
          subject,
          text,
        }

        if (test) {
          console.log(`=======================TEST MODE=======================`)
          console.log(`To: ${brand.to.email}`)
          console.log(`From: ${from.email}`)
          console.log(`Subject: ${subject}\n`)
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
      try {
        KlaviyoClient.public.track({
          event: "Sample Order",
          email: res.data.billing.email,
        })
        console.log(`User with email: ${res.data.billing.email} added to Klaviyo Samples Flow`)
      } catch (error) {
        console.log("Klaviyo Error: Does this order have an email address?")
      }
    }
  } catch (error) {
    console.log(error)
  }
}

main()
