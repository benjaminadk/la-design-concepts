const puppeteer = require('puppeteer')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

const scraper = async () => {
  const browser = await puppeteer.launch({})

  try {
    const raw = await readFile('data-1.json')
    const parsed = JSON.parse(raw)
    const data = []

    const page = await browser.newPage()

    for (let [i, p] of parsed.entries()) {
      await page.goto(`https://www.fschumacher.com/item/${p.sku}`, {
        waitUntil: 'networkidle2'
      })

      if (i === 0) {
        const [response1] = await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.click('input[value="SIGN IN"]')
        ])

        await page.type('#User', 'ryan@ladesignconcepts.com', { delay: 100 })
        await page.type('#Password', 'm2xk-px27', { delay: 100 })

        const [response2] = await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.click('input[value="SIGN IN"]')
        ])
      }

      let report = await page.evaluate(async function() {
        const secret = document
          .querySelector('.small-11.small-offset-1.columns.font-bold-19')
          .textContent.replace(/\s\s+/g, '')

        var e1 = document.querySelectorAll(
          '.medium-4.medium-offset-2.columns.font-regular-14>.font-grey'
        )

        var e2 = document.querySelectorAll(
          '.medium-4.medium-offset-1.columns.font-regular-14.end>.font-grey'
        )

        var width, hrep, vrep, match
        e1.forEach((e, j) => {
          if (j === 0) {
            width = e.textContent
          } else if (j === 1) {
            hrep = e.textContent
          } else if (j === 2) {
            vrep = e.textContent
          } else if (j === 3) {
            match = e.textContent
          }
        })

        var content, perf, light, country
        e2.forEach((e, j) => {
          if (j === 0) {
            content = e.textContent
          } else if (j === 1) {
            perf = e.textContent
          } else if (j === 2) {
            light = e.textContent
          } else if (j === 3) {
            country = e.textContent
          }
        })

        return { secret, width, hrep, vrep, match, content, perf, light, country }
      })

      data[i] = {
        ...p,
        ...report
      }
    }

    await browser.close()

    fs.writeFile('data-2.json', JSON.stringify(data), err => {
      if (err) throw err
      console.log('saved')
    })
  } catch (err) {
    console.log(err)
  }
}

scraper()
