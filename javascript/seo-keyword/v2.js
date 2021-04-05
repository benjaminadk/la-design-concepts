async function main() {
  writer.write('term,rank\n')
  const browser = await puppeteer.launch({ headless: false, devtools: true })

  try {
    for (let term of SEARCH_TERMS) {
      const rank = await getPageRank(browser, term)
      writer.write(`${term},${rank}\n`)
    }

    await browser.close()
  } catch (error) {
    await browser.close()
    console.log(error)
  }
}

async function getPageRank(browser, term, start = 0) {
  try {
    let query = `?q=${term.replace(/\s/g, '+')}&start=${start}`
    let page = await browser.newPage()

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
