#!/usr/bin/env node

const program = require("commander")
const { create } = require("xmlbuilder2")
const {
  directoryExists,
  readdir,
  mkdir,
  rm,
  writeFile
} = require("./lib/utils")
const path = require("path")

program
  .option(
    "-s, --source [filename]",
    "A relative path to a file exporting a JavaScript array of URLs",
    "brand-pages"
  )
  .option(
    "-d, --destination [filename]",
    "Name for generated sitemap",
    "sitemap"
  )
  .option(
    "-f, --frequency [value]",
    "Tell crawler how often to crawl pages",
    "weekly"
  )
  .option(
    "-p, --priority",
    "Tell the crawler how important crawling this url is",
    "1.0"
  )
  .parse(process.argv)

const main = async () => {
  const { source, destination, frequency, priority } = program
  const srcPath = path.join(process.cwd(), "sitemap-data", source + ".js")
  const dstPath = path.join(process.cwd(), "sitemaps", destination + ".xml")

  // TODO Validate input

  const data = require(srcPath)

  const root = create({ version: "1.0" }).ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
  })

  for (let d of data) {
    var url = root.ele("url")
    url.ele("loc").txt(d)
    url.ele("lastmod").txt(new Date().toISOString())
    url.ele("changefreq").txt(frequency)
    url.ele("priority").txt(priority)
  }

  const xml = root.end({ prettyPrint: true })

  await writeFile(dstPath, xml)
}

main()
