#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const { writeFile } = require('./lib/utils')
const { src } = require('./redirects/test')

program
  .option(
    '-f,--filename [name]',
    'Destination file where formatted redirects will be saved',
    'redirects.txt'
  )
  .parse(process.argv)

const main = async () => {
  const { filename } = program

  const root = 'https://ladesignconcepts.com/'
  const dst = src.map((el) => {
    if(el.includes('add_to_wishlist')) {
      return false
    }
    if (el.includes('shopping/textiles/')) {
      let subroot = 'shop/textiles/fabric/'
      if (el.includes('baker-lifestyle')) {
        return `${root}${subroot}baker-lifestyle/`
      } else if (el.includes('brentano')) {
        return `${root}${subroot}brentano/`
      } else if (el.includes('brunschwig-fils')) {
        return `${root}${subroot}brunschwig-and-fils-fabric/`
      } else if (el.includes('castel-maison')) {
        return `${root}${subroot}castel/`
      } else if (el.includes('christopher-farr')) {
        return `${root}${subroot}christopher-farr/`
      } else if (
        el.includes('clarke-clarke') ||
        el.includes('clarke-and-clarke')
      ) {
        return `${root}${subroot}clarke-and-clarke-fabrics/`
      } else if (
        el.includes('designers_guild') ||
        el.includes('designers-guild')
      ) {
        return `${root}${subroot}designers-guild-fabric/`
      } else if (el.includes('duralee')) {
        return `${root}${subroot}schumacher-fabric/`
      } else if (el.includes('colony')) {
        return `${root}${subroot}colony-fabrics/`
      } else if (el.includes('clarence-house')) {
        return `${root}${subroot}`
      } else if (el.includes('fabricut')) {
        return `${root}${subroot}fabricut-fabrics/`
      } else if (el.includes('gaston-y')) {
        return `${root}${subroot}gaston-y-daniela/`
      } else if (el.includes('g-p-j-baker')) {
        return `${root}${subroot}gp-and-j-baker-fabrics/`
      } else if (el.includes('groundworks')) {
        return `${root}${subroot}groundworks/`
      } else if (el.includes('kravet')) {
        return `${root}${subroot}kravet-fabric/`
      } else if (el.includes('lee-jofa')) {
        return `${root}${subroot}lee-jofa-fabric/`
      } else if (el.includes('lorca')) {
        return `${root}${subroot}lorca/`
      } else if (el.includes('mulberry-home')) {
        return `${root}${subroot}mullberry-home/`
      } else if (el.includes('nina-campbell')) {
        return `${root}${subroot}nina-campbell/`
      } else if (el.includes('opuzen')) {
        return `${root}${subroot}opuzen-fabrics/`
      } else if (el.includes('osborne-little')) {
        return `${root}${subroot}osborne-little/`
      } else if (el.includes('pindler')) {
        return `${root}${subroot}pindler-fabrics/`
      } else if (el.includes('ralph-lauren')) {
        return `${root}${subroot}ralph-lauren-fabric/`
      } else if (el.includes('robert-allen')) {
        return `${root}${subroot}`
      } else if (el.includes('s-harris')) {
        return `${root}${subroot}s-harris-fabrics/`
      } else if (el.includes('scalamandre')) {
        return `${root}${subroot}scalamandre-fabrics/`
      } else if (el.includes('schumacher')) {
        return `${root}${subroot}schumacher-fabric/`
      } else if (el.includes('trend')) {
        return `${root}${subroot}trend-fabrics/`
      } else if (el.includes('vervain')) {
        return `${root}${subroot}vervain/`
      } else {
        return `${root}${subroot}`
      }
    } else if (el.includes('shopping/wallcoverings/')) {
      let subroot = 'shop/wallcoverings/wallpaper/'
      if (el.includes('cole-son')) {
        return `${root}${subroot}cole-and-son-wallpaper/`
      } else if (el.includes('brunschwig-fils')) {
        return `${root}${subroot}brunschwig-and-fils-wallpaper/`
      } else if (el.includes('clarence-house')) {
        return `${root}${subroot}`
      } else if (el.includes('christopher-farr')) {
        return `${root}${subroot}christopher-farr/`
      } else if (
        el.includes('clarke-clarke') ||
        el.includes('clarke-and-clarke')
      ) {
        return `${root}${subroot}clarke-and-clarke-wallpaper/`
      } else if (
        el.includes('designers_guild') ||
        el.includes('designers-guild')
      ) {
        return `${root}${subroot}designers-guild-wallpaper/`
      } else if (el.includes('fabricut')) {
        return `${root}${subroot}fabricut-wallpaper/`
      } else if (el.includes('kravet')) {
        return `${root}${subroot}kravet/`
      } else if (el.includes('lee-jofa')) {
        return `${root}${subroot}lee-jofa/`
      } else if (el.includes('maya-romanoff')) {
        return `${root}${subroot}/maya-romanoff/`
      } else if (el.includes('nina-campbell')) {
        return `${root}${subroot}nina-campbell/`
      } else if (el.includes('osborne-little')) {
        return `${root}${subroot}osborne-little/`
      } else if (el.includes('ralph-lauren')) {
        return `${root}${subroot}ralph-lauren-wallpaper/`
      } else if (el.includes('scalamandre')) {
        return `${root}${subroot}scalamandre/`
      } else if (el.includes('schumacher')) {
        return `${root}${subroot}schumacher-wallpaper/`
      } else if (el.includes('winfield-thybony')) {
        return `${root}${subroot}winfield-thybony/`
      } else {
        return `${root}${subroot}`
      }
    } else if (el.includes('shopping/accessories/')) {
      let subroot = 'shop/accessories/'
      if (el.includes('kravet-curated')) {
        return `${root}${subroot}curated-kravet`
      } else {
        return `${root}${subroot}`
      }
    } else if (el.includes('shopping/furniture/chairs/')) {
      return `${root}shop/furniture/chairs/`
    } else if (el.includes('shopping/lighting')) {
      return `${root}shop/lighting/`
    } else if (el.includes('shopping/uncategorized/')) {
      return root
    } else if (el.includes('sitemap')) {
      return `${root}sitemap.xml`
    } else if (
      el.includes('var_custom') ||
      el.includes('standard-size') ||
      el.includes('size/')
    ) {
      return `${root}`
    } else if (el.includes('blog')) {
      return `${root}blog/`
    } else {
      return false
    }
  })

  let data = ''
  for (let i = 0; i < src.length; i++) {
    if (dst[i]) {
      data += `location = ${src[i].replace('https://ladesignconcepts.com', '')} {
      return 301 ${dst[i]};
      }\n`
    }
  }

  await writeFile(path.join(process.cwd(), 'redirects', filename), data)
}

main()
