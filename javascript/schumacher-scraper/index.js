const data = require('./data')
const axios = require('axios').default
const fs = require('fs')

const main = async () => {
  let res = []
  let base = 'https://schumacher-api-prd.azurewebsites.net/api/products/'

  for (let d of data) {
    try {
      let r = await axios({
        method: 'GET',
        url: `${base}${d}`,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
      })
      r && r.data && res.push(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  fs.writeFileSync('data.json', JSON.stringify(res))
}

main()
