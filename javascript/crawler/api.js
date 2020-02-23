const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default

const WooCommerce = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: '',
  consumerSecret: '',
  version: 'wc/v2',
  queryStringAuth: true
})

WooCommerce.get('products', {
  per_page: 10,
  page: 1,
  status: 'publish',
  _fields: 'permalink'
})
  .then(res => {
    console.log(res.data)
  })
  .catch(error => {
    console.log(error.response.data)
  })
