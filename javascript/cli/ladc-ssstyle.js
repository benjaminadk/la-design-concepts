#!/usr/bin/env node

const program = require("commander")
const puppeteer = require("puppeteer")
const path = require("path")

// Optional device string
program
  .option(
    "-d, --device [type]",
    "Device type. Determines screen size.",
    "mobile"
  )
  .parse(process.argv)

// Main function
const main = async () => {
  // Parse options
  const { device } = program

  // Launch Puppeteer
  const browser = await puppeteer.launch()

  try {
    // Create new page navigate to LADC brand list page
    // const context = await browser.createIncognitoBrowserContext();
    // const page = await context.newPage();
    const page = await browser.newPage()

    await page.goto("https://ladesignconcepts.com/shop-by-style/")

    // Grab all brand page links
    const collectionsF = await page.$$("#fabric-collections a")
    const collectionsW = await page.$$("#wallpaper-collections a")

    // Loop over brand page links
    for (let [i, collection] of [...collectionsF, ...collectionsW].entries()) {
      // Parse href and link text
      const href = await page.evaluate(el => el.href, collection)
      const text = await page.evaluate(el => el.querySelector('.collection-label').textContent, collection)

      // Open new page and set screen size to match device option
      // Based on most popular sizes
      // Desktop 1360x768
      // Tablet 1024x768 - horizontal and vertical options iPad
      // Phone 400x800 - iPhone 10
      const newPage = await browser.newPage()
      await newPage.setViewport({
        width:
          device === "mobile"
            ? 400
            : device === "tablet-h"
            ? 1024
            : device === "tablet-v"
            ? 768
            : 1360,
        height:
          device === "mobile"
            ? 800
            : device === "tablet-h"
            ? 768
            : device === "tablet-v"
            ? 1024
            : 768
      })

      // Navigate to brand page
      await newPage.goto(href)

      // Take screenshot and save to folder based on device and brand name
      // TODO integrate directly to Drive
      await newPage.screenshot({
        path: path.join(__dirname, "screenshots-styles", device, `${text}.png`)
      })

      console.log(`Screenshot saved for ${text}`)

      // Close page
      await newPage.close()
    }

    // Close browser
    await browser.close()
  } catch (error) {
    console.log(error)
  } finally {
    console.log(`Screenshots saved to ${path.join(__dirname, "screenshots-styles")}`)
  }
}

main()
