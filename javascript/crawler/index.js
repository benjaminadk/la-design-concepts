const siteMap = require('sitemap-crawler')
const link = 'https://ladesignconcepts.com/blog'

siteMap(link, (err, res) => {
  console.log('error:', err)
  console.log(res)
})
