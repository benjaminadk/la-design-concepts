#!/usr/bin/env node

const program = require('commander')
const puppeteer = require('puppeteer')
const fullPageScreenshot = require('puppeteer-full-page-screenshot').default
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const path = require('path')
const brands = require('./lib/brands')
const createEmail = require('./lib/email-template')
const { getAccessToken } = require('./lib/drive')

program.parse(process.argv)

const main = async () => {
  const browser = await puppeteer.launch({ headless: true })

  try {
    const report = []

    for (let brand of brands) {
      const page = await browser.newPage()

      await page.setViewport({ width: 1000, height: 2000 })
      await page.goto(`https://www.google.com/search?q=${brand.q}`)

      await page.$eval('div#searchform', el => (el.style.display = 'none'))

      await fullPageScreenshot(page, {
        path: path.join(
          process.cwd(),
          'screenshots',
          'seo',
          `${brand.brand}.png`
        )
      })

      const ranking = await page.evaluate(properties => {
        let results = Array.from(document.querySelectorAll('.rc')).map(
          el => el.querySelector('cite').textContent
        )

        let rank = results.findIndex(el => el.includes('ladesignconcepts'))

        return {
          ...properties,
          rank: rank === -1 ? 'n/a' : rank + 1
        }
      }, brand)

      report.push(ranking)

      await page.close()
    }

    await browser.close()

    const transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_KEY
        }
      })
    )

    await transport.sendMail({
      from: '"Ben 🤓" <ben@ladesignconcepts.com>',
      to: 'benjaminadk@gmail.com',
      subject: 'LADC SEO Google Search Rankings',
      html: await createEmail(report)
    })
  } catch (error) {
    console.log(error)
  } finally {
  }
}

main()
