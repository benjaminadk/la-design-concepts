const { google } = require('googleapis')
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const { promisify } = require('util')

const API = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

module.exports = async (auth) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheets = google.sheets({ version: 'v4', auth })
    const getSheet = promisify(sheets.spreadsheets.values.get).bind(sheets)
    const updateSheet = promisify(sheets.spreadsheets.values.update).bind(
      sheets
    )

    const res1 = await getSheet({
      spreadsheetId,
      range: 'April!A2:A1000',
    })

    const rows = res1.data.values
    const lastOrder = rows ? rows[rows.length - 1][0] : process.env.LAST_ORDER

    const res2 = await API.get(`orders/${lastOrder}`)
    const after = res2.data.date_created

    const res3 = await API.get(`orders`, {
      per_page: 100,
      order: 'asc',
      after,
    })

    const toProcess = []

    for (let order of res3.data) {
      let line_items = order.line_items
      let keep = false
      let brand = ''
      let custom = false

      for (let item of line_items) {
        if (item.name !== 'Sample') {
          keep = true

          const res4 = await API.get(`products/${item.product_id}`)

          var brandName

          try {
            brandName = res4.data.attributes.find((el) => el.name === 'brand')[
              'options'
            ][0]
          } catch (error) {
            custom = true

            try {
              brandName = item.meta_data[0]['display_key']
            } catch (error) {
              brandName = 'CUSTOM'
            }
          }

          brand += brand.length ? `, ${brandName}` : brandName
        }
      }

      if (keep) {
        toProcess.push([order.id, order.date_created, brand, order.total])
      }
    }

    const res5 = await updateSheet({
      spreadsheetId,
      range: 'April!A2:D1000',
      valueInputOption: 'RAW',
      resource: { values: toProcess },
    })
  } catch (error) {
    console.log(error)
  }
}
