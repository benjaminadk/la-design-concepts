#!/usr/bin/env node

const program = require('commander')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot').default
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const path = require('path')
const brands = require('./lib/brands')
const collections = require('./lib/collections')
const createEmail = require('./lib/email-template')
const { getAccessToken } = require('./lib/drive')
const { writeFileSync } = require('fs')

program
  .option(
    '-e,--emails [list]',
    'Comma separated list of email recipients',
    'ben@ladesignconcepts.com'
  )
  .option('-c, --category [type]', 'Brand or Collection', 'brand')
  .parse(process.argv)

const main = async () => {
  const { emails, category } = program

  const browser = await puppeteer.launch({ headless: true })

  try {
    const report = []

    let items =
      category === 'brand'
        ? brands
        : category === 'collection'
        ? collections
        : [...brands, ...collections]

    for (let item of items) {
      const page = await browser.newPage()

      await page.setViewport({ width: 1000, height: 2000 })

      await new Promise((res, rej) => {
        setTimeout(res, 5000)
      })

      await page.goto(`https://www.google.com/search?q=${item.q}`)

      // await page.$eval("div#searchform", el => (el.style.display = "none"))

      await fullPageScreenshot(page, {
        path: path.join(
          process.cwd(),
          'screenshots',
          'seo',
          `${item.name}.png`
        ),
      })

      const ranking = await page.evaluate((properties) => {
        // let adRoot = document.getElementById("tads")

        // let adResults = adRoot
        //   ? Array.from(adRoot.querySelectorAll("li.ads-ad")).map(
        //       el => el.querySelector(".ads-visurl cite").textContent
        //     )
        //   : []

        let results = Array.from(document.querySelectorAll('.rc')).map(
          (el) => el.querySelector('cite').textContent
        )

        let combinedResults = [...results]

        let rank = combinedResults.findIndex((el) =>
          el.includes('ladesignconcepts')
        )

        if (rank === -1) {
          // check next page
          // recursive function that has a depth limit so it doesnt search forever
        }

        return {
          ...properties,
          rank: rank === -1 ? 'n/a' : rank + 1,
          // ads: adResults.length,
          // isAd: rank === -1 ? false : rank < adResults.length ? true : false
        }
      }, item)

      report.push(ranking)

      await page.close()
    }

    await browser.close()

    const transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY,
        },
      })
    )

    await transport.sendMail({
      from: '"Ben 🤓" <ben@ladesignconcepts.com>',
      to: emails,
      subject: 'LADC SEO Google Search Rankings',
      html: await createEmail(report),
    })

    writeFileSync(
      path.join(process.cwd(), 'screenshots', 'report.json'),
      JSON.stringify(report)
    )
  } catch (error) {
    console.log(error)
  } finally {
  }
}

main()
