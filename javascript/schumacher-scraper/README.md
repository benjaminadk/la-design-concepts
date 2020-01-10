# Schumacher Web Scraper

## Usage

From this directory run. Part 2 will take the longest by far. It is making over 6000 HTTP requests

```
node part-1.js
// wait to finish
node part-2.js
// wait to finish
node part-3.js
// wait to finish
```

## How it Works

- Uses [Puppeteer](https://pptr.dev/) to in headless mode to scrape details of Schumacher's entire fabric line
- Runs in three parts to simplify script

- **Part 1**

  - Gathers all image urls, skus and prices
  - Simply substitute 1024 for 300 in image url to download better quality image later on
  - Creates `data-1.json`

- **Part 2**

  - Reads `data-1.json` to and looks up every sku to bring up individual fabric page
  - Gathers all the details including information that requires trade account login
  - Logs in at the start which creates a 14 day cookie
  - Creates `data-2.json`

- **Part 3**
  - Simple cleanup of text data - could be done in excel but is easier with js
  - Creates `data-3.json`
  - Import this file into Excel
