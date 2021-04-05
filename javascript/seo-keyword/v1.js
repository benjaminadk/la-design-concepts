async function main() {
  const browser = await puppeteer.launch()

  try {
    for (let term of SEARCH_TERMS) {
      let query = term.replace(/\s/g, '+')

      const page = await browser.newPage()
      await pause(DELAY)
      await page.goto(`https://www.google.com/search?q=${query}`)

      const data = await page.evaluate(() => {
        const rank =
          Array.from(document.querySelectorAll('.g'))
            .filter((el) => {
              let style = window.getComputedStyle(el)
              return el.classList.length === 1 && style.visibility === 'visible'
            })
            .map((el) => el.querySelector('cite').textContent)
            .findIndex((el) => el.includes('ladesignconcepts')) + 1

        return rank === -1 ? 'N/A' : rank
      })

      writer.write(`${term},${data}\n`)

      await page.close()
    }

    await browser.close()
  } catch (error) {
    await browser.close()
    console.log(error)
  }
}
