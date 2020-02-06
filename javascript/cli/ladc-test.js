#!/usr/bin/env node

const program = require('commander')
const puppeteer = require('puppeteer')
const path = require('path')

program.option('-d, --device [type]', 'Device type. Determines screen size.', 'mobile').parse(process.argv)

const delay = timeout => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}

const main = async () => {
  const {device} = program

  const browser = await puppeteer.launch()

  try {
    const page = await browser.newPage()
    await page.goto('https://ladesignconcepts.com/shop-by-brand/')
    const brands = await page.$$('.shop-list a')

    for (let [i, brand] of brands.entries()) {
      const href = await page.evaluate(el => el.href, brand)
      const text = await page.evaluate(el => el.textContent, brand)
      const newPage = await browser.newPage()
      await newPage.setViewport({
        width: device === 'mobile' ? 400 : device === 'tablet' ? 1024 : 1280,
        height: device === 'mobile' ? 800 : device === 'tablet' ? 768 : 1100
      })
      await newPage.goto(href)
      console.log(`Capturing ${text}`)
      await newPage.screenshot({
        path: path.join(__dirname, 'screenshots', device, `${text}.png`)
      })
      await newPage.close()
    }

    await browser.close()
  } catch (error) {
    console.log(error)
  } finally {
    console.log(`Screenshots saved to ${path.join(__dirname, 'screenshots')}`)
  }
}

main()
