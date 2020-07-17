#!/usr/bin/env node

const program = require("commander")
const { google } = require("googleapis")
const request = require("request")

const credentials = require("./credentials-ladc.json")
const KEY = 'AIzaSyC1nEVnyvslQlkjRuv--zueRsl8paKlAAA'

program.parse(process.argv)

const main = async () => {
  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/webmasters"],
    null
  )

  const siteUrl = "https://ladesignconcepts.com/"
  const feedPaths1 = [
    "https://ladesignconcepts.com/sitemap.xml",
    "https://ladesignconcepts.com/sitemap-misc.xml",
    "https://ladesignconcepts.com/sitemap-tax-product_cat.xml",
    "https://ladesignconcepts.com/sitemap-externals.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2020-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-09.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2019-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-09.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2018-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2017-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-09.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2016-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2015-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-2015-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-product-1970-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2020-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-09.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2019-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2018-12.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2018-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2018-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-post-2018-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-05.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-04.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-03.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2020-01.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2019-10.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2019-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2017-07.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2016-06.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2016-02.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2015-08.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2014-11.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2014-09.xml",
    "https://ladesignconcepts.com/sitemap-pt-page-2014-05.xml",
  ]

  let feedPaths = ["https://ladesignconcepts.com/sitemap-pt-product-2018-09.xml"]

  client.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
      return
    }

    console.log(tokens)

    for (let feedPath of feedPaths) {
      let options = {
        url: `https://googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedPath}?key=${KEY}`,
        method: "PUT",
        auth: { bearer: tokens.access_token },
      }

      request(options, function (error, response, body) {
        console.log(response.statusCode)
        if (error) {
          console.log("error", error)
        }
      })
    }
  })
}

main()


