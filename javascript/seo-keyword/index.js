// const puppeteer = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
var userAgent = require('user-agents')
const randomUseragent = require('random-useragent')
const { createWriteStream, write } = require('fs')
const { autoScroll, pause } = require('./utils')

const CATEGORIES = [
  'designer fabric',
  'designer fabric online',
  'designer wallpaper',
]

const STYLES = [
  // 'abstract fabric',
  // 'abstract wallpaper',
  // 'animal fabric',
  // 'animal wallpaper',
  // 'asian fabric',
  // 'asian wallpaper',
  // 'bird fabric',
  // 'bird wallpaper',
  // 'botanical fabric',
  // 'botanical wallpaper',
  // 'chenille fabric',
  // 'check wallpaper',
  // 'damask fabric',
  // 'damask wallpaper',
  // 'denim fabric',
  // 'diamond wallpaper',
  // 'emdbroidered fabric',
  // 'floral fabric',
  // 'floral wallpaper',
  // 'geometric fabric',
  // 'geometric wallpaper',
  // 'houndstooth fabric',
  // 'ikat fabric',
  // 'metallic fabric',
  // 'metallic wallpaper',
  // 'modern fabric',
  // 'modern wallpaper',
  // 'nautical fabric',
  // 'nautical wallpaper',
  // 'paisley fabric',
  // 'paisley wallpaper',
  // 'plaid fabric',
  // 'plaid wallpaper',
  // 'plain wallpaper',
  // 'sheer fabric',
  'southwest fabric',
  'striped fabric',
  'striped wallpaper',
  'tapestry fabric',
  'tapestry wallpaper',
  'texture fabric',
  'texture wallpaper',
  'tropical fabric',
  'tropical wallpaper',
  'toile fabric',
  'toile wallpaper',
  'quilted fabric',
  'velvet fabric',
  'whimsical wallpaper',
]

const COLORS = ['beige fabric', 'beige wallpaper']

const SEARCH_TERMS = [...STYLES]
const DELAY = 5000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'

const writer = createWriteStream('seo-report.csv')
var count = 0
async function main() {
  writer.write('term,rank\n')
  const browser = await puppeteer.launch()

  try {
    for (let term of SEARCH_TERMS) {
      const rank = await getPageRank(browser, term, 0)
      writer.write(`${term},${rank}\n`)
    }

    await browser.close()
  } catch (error) {
    await browser.close()
    console.log(error)
  }
}

async function getPageRank(browser, term, start) {
  try {
    let query = `?q=${term.replace(/\s/g, '+')}&start=${start}`
    console.log(count++, query)
    // const userAgent = randomUseragent.getRandom((ua) => ua.osName === 'Windows')
    const userAgent = false
    const UA = userAgent || USER_AGENT
    let page = await browser.newPage()
    await page.setUserAgent(UA)
    await page.goto(`https://www.google.com/search${query}`)
    await pause(DELAY)
    await autoScroll(page)

    var data = await page.evaluate((start) => {
      let results = Array.from(document.querySelectorAll('.g'))
        .filter((el) => {
          let style = window.getComputedStyle(el)
          return el.classList.length === 1 && style.visibility === 'visible'
        })
        .map((el) => el.querySelector('cite').textContent)

      let ranking =
        results.findIndex((el) => el.includes('ladesignconcepts')) + 1

      return {
        ranking,
        start: results.length + 1 + start,
      }
    }, start)

    await page.close()

    if (data.ranking === 0) {
      if (data.start >= 100) {
        return 'N/A'
      } else {
        return getPageRank(browser, term, data.start)
      }
    } else {
      return data.ranking + start
    }
  } catch (error) {
    await browser.close()
    console.log(error)
  }
}

main()
