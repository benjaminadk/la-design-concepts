const puppeteer = require('puppeteer')
const fs = require('fs')

let pagenumber = 1
const total = 6687
const rowsperpage = 50
const iterations = Math.ceil(total / rowsperpage)
const url = 'https://www.fschumacher.com/Catalog/GetProducts'
const params =
  'pagenumber=2&departmentname=Fabrics&rowperpage=30&sortby=Popularity&pricefrom=0&priceto=300'

const scraper = async () => {
  const browser = await puppeteer.launch()
  try {
    const page = await browser.newPage()
    var report = []

    for (let j = pagenumber; j < iterations; j++) {
      await page.goto(
        `${url}?pagenumber=${j}&departmentname=Fabrics&rowperpage=50&sortby=Popularity&pricefrom=0&priceto=300`
      )

      const pg_report = await page.evaluate(async function() {
        const data = []
        const products = document.querySelectorAll('.product-preview')

        for (let i = 0; i < products.length; i++) {
          const pattern = products[i].querySelector('.product-name').textContent
          const img = products[i].querySelector('img').src
          const color = products[i].querySelector('.product-color').textContent
          const sku = products[i].querySelector('.product-sku').textContent
          const type = products[i].querySelector('.product-type').textContent
          const price = products[i].querySelector('.product-price>span').textContent

          data[i] = {
            sku,
            pattern,
            img,
            color,
            type,
            price
          }
        }

        return data
      })

      report = [...pg_report, ...report]
    }

    await browser.close()

    fs.writeFile('data-1.json', JSON.stringify(report), err => {
      if (err) throw err
      console.log('saved')
    })
  } catch (err) {
    console.log(err)
    browser.close()
  }
}

scraper()
