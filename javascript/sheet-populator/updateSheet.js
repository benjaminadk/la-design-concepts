const { google } = require('googleapis')
const moment = require('moment')
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
    const batchUpdateSheet = promisify(sheets.spreadsheets.batchUpdate).bind(
      sheets
    )

    const res1 = await getSheet({
      spreadsheetId,
      range: 'April!A2:A1000',
    })

    const rows = res1.data.values
    const lastOrder = rows ? rows[0][0] : process.env.LAST_ORDER
    const rowIndex = rows ? rows.length + 2 : 2

    const res2 = await API.get(`orders/${lastOrder}`)
    const after = res2.data.date_created

    const res3 = await API.get(`orders`, {
      per_page: 100,
      order: 'desc',
      status: ['pending', 'processing', 'on-hold', 'completed'],
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
            brandName = res4.data.attributes
              .find((el) => el.name === 'brand')
              ['options'][0].replace('&amp;', 'and')
          } catch (error) {
            custom = true

            try {
              brandName = item.meta_data[0]['display_key'].replace(
                '&amp;',
                'and'
              )
            } catch (error) {
              console.log(`Problem with order #${order.id}`)
              keep = false
            }
          }

          brand += brand.length ? `, ${brandName}` : brandName
        }
      }

      if (keep) {
        toProcess.push([
          order.id,
          moment(order.date_created).format('M/D/YYYY'),
          brand,
          order.total,
        ])
      }
    }

    const res5 = await updateSheet({
      spreadsheetId,
      range: `April!A${rowIndex}:D1000`,
      valueInputOption: 'RAW',
      resource: { values: toProcess },
    })

    const res6 = await batchUpdateSheet({
      spreadsheetId,
      resource: {
        requests: [
          {
            sortRange: {
              range: {
                sheetId: 0,
                startRowIndex: 1,
                endRowIndex: 1000,
                startColumnIndex: 0,
                endColumnIndex: 6,
              },
              sortSpecs: [
                {
                  sortOrder: 'DESCENDING',
                  dataSourceColumnReference: {
                    name: 'Order Number',
                  },
                },
              ],
            },
          },
          {
            deleteDuplicates: {
              range: {
                sheetId: 0,
                startRowIndex: 1,
                endRowIndex: rows.length + res5.data.updatedRows + 1,
                startColumnIndex: 0,
                endColumnIndex: 6,
              },
              comparisonColumns: [
                {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 6,
                },
              ],
            },
          },
        ],
      },
    })
  } catch (error) {
    console.log(error)
  }
}
