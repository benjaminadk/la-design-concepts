async function main() {
  writer.write('term,rank\n')
  const browser = await puppeteer.launch({ devtools: true })

  try {
    for (let term of SEARCH_TERMS) {
      const rank = await getPageRank(browser, null, term, 0)
      writer.write(`${term},${rank}\n`)
      console.log(count)
    }

    await browser.close()
  } catch (error) {
    await browser.close()
    console.log(error)
  }
}

async function getPageRank(browser, page, term, start) {
  count++

  try {
    let query = `?q=${term.replace(/\s/g, '+')}`

    if (start === 0) {
      const userAgent = randomUseragent.getRandom()
      const UA = userAgent || USER_AGENT
      page = await browser.newPage()
      // await page.setViewport({
      //   width: 1920 + Math.floor(Math.random() * 100),
      //   height: 3000 + Math.floor(Math.random() * 100),
      //   deviceScaleFactor: 1,
      //   hasTouch: false,
      //   isLandscape: false,
      //   isMobile: false,
      // })

      await page.setUserAgent(UA)
      await page.setJavaScriptEnabled(true)
      await page.setDefaultNavigationTimeout(0)
      await page.goto(`https://www.google.com`, {
        waitUntil: 'networkidle2',
        timeout: 0,
      })

      await page.type('input[name="q"]', term, { delay: 200 })
      await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]', { delay: 200 }),
      ])
    } else {
      try {
        await Promise.all([
          page.waitForNavigation(),
          page.click('a#pnnext', { delay: 200 }),
        ])
      } catch (error) {
        await pause(100000)
      }
    }

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

    if (data.ranking === 0) {
      if (start >= 90) {
        return 'N/A'
      } else {
        return getPageRank(browser, page, term, data.start)
      }
    } else {
      await page.close()
      return data.ranking + start
    }
  } catch (error) {
    await page.close()
    console.log(error)
  }
}
