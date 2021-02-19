const axios = require('axios')

const url = 'https://api.reviews.co.uk'
const store = 'la-design-concepts'
const apikey = '6fbd76b58240844bb9535f3d21b49fb2'

const main = async () => {
  const res = await axios({
    method: 'GET',
    url: url + '/merchant/latest',
    headers: {
      store,
      apikey
    }
  })

  console.log(res.data)
}

main()