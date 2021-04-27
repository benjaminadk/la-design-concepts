const { google } = require('googleapis')
const moment = require('moment')
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const { promisify } = require('util')

// WooCommerce REST API config
const API = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

module.exports = async (auth) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const timestamp = `[${moment().format('M/D/YYYY hh:mm A')}]`
    const month = moment().format('MMMM')
    const totalColumns = 14
    const sheets = google.sheets({ version: 'v4', auth })

    // Async versions of Sheet methods
    const getSheet = promisify(sheets.spreadsheets.values.get).bind(sheets)
    const updateSheet = promisify(sheets.spreadsheets.values.update).bind(
      sheets
    )
    const batchUpdateSheet = promisify(sheets.spreadsheets.batchUpdate).bind(
      sheets
    )

    // Fetch current sheet
    const res1 = await getSheet({
      spreadsheetId,
      range: `${month}!C2:C1000`,
    })

    const rows = res1.data.values

    // If sheet is blank use env var as fallback
    const lastOrder = rows ? rows[0][0] : process.env.LAST_ORDER

    // First blank row
    const rowIndex = rows ? rows.length + 2 : 2

    // Fetch last order currently in sheet
    // Use sheets created date as after param for next fetch
    const res2 = await API.get(`orders/${lastOrder}`)
    const after = res2.data.date_created

    // Fetch latest orders
    // Use descending order and omit failed and cancelled orders
    const res3 = await API.get(`orders`, {
      per_page: 100,
      order: 'desc',
      status: ['pending', 'processing', 'on-hold', 'completed'],
      after,
    })

    // Array of new orders to send to sheet
    const toProcess = []

    // Loop over latest orders
    for (let order of res3.data) {
      let line_items = order.line_items
      let keep = false
      let item_data = []
      let custom = false

      // Loop over line items
      for (let item of line_items) {
        // Only keep non sample line items
        if (item.name !== 'Sample') {
          keep = true

          // Fetch line item to get brand name
          const res4 = await API.get(`products/${item.product_id}`)

          var brandName
          var cfa

          // If no brand attribute is set item is custom
          try {
            brandName = res4.data.attributes
              .find((el) => el.name === 'brand')
              ['options'][0].replace('&amp;', 'and')

            let cfaObj = item.meta_data.find(
              (el) => el.key === 'Cutting for Approval (CFA)'
            )
            cfa = cfaObj && cfaObj.value === 'Yes' ? 'Yes' : ''
          } catch (error) {
            custom = true

            // Attempt to get brand from first meta data entry
            // Relies on salesperson's manual input in WP Dashboard
            try {
              brandName = item.meta_data[0]['display_key'].replace(
                '&amp;',
                'and'
              )
            } catch (error) {
              // If anything goes wrong skip
              // Salesperson might not have completed writing order
              console.log(
                `${timestamp} Issue with #${order.id}. No custom order brand meta data.`
              )
              keep = false
            }
          }

          // Allow multiple brands when custom orders multiple products
          item_data.push({
            cfa,
            brand: brandName,
          })
        }
      }

      // Add keepers to the processing array
      // Use order id to create hyperlink to WP Dashboard
      // Format date and time with moment
      if (keep) {
        for (let item in item_data) {
          toProcess.push([
            moment(order.date_created).format('M/D/YYYY'),
            moment(order.date_created).format('hh:mm A'),
            `=hyperlink("https://ladesignconcepts.com/wp-admin/post.php?post=${order.id}&action=edit","${order.id}")`,
            order?.shipping?.last_name ||
              order?.billing?.last_name ||
              order?.shipping?.company,
            item.brand,
            order.total,
          ])
        }
      }
    }

    if (toProcess.length) {
      // Add new rows to bottom of sheet
      const res5 = await updateSheet({
        spreadsheetId,
        range: `${month}!A${rowIndex}:F1000`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: toProcess },
      })

      // Sort sheet by order number and delete any duplicate order ids
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
                  endColumnIndex: totalColumns,
                },
                sortSpecs: [
                  {
                    sortOrder: 'DESCENDING',
                    dimensionIndex: 2,
                  },
                ],
              },
            },
            {
              deleteDuplicates: {
                range: {
                  sheetId: 0,
                  startRowIndex: 1,
                  endRowIndex:
                    (rows ? rows.length : 0) + res5.data.updatedRows + 1,
                  startColumnIndex: 0,
                  endColumnIndex: totalColumns,
                },
                comparisonColumns: [
                  {
                    sheetId: 0,
                    dimension: 'COLUMNS',
                    startIndex: 0,
                    endIndex: totalColumns,
                  },
                ],
              },
            },
          ],
        },
      })

      // Logging
      console.log(`${timestamp} added ${res5.data.updatedRows} rows.`)
    } else {
      console.log(`${timestamp} added 0 rows.`)
    }
  } catch (error) {
    console.log('========Error=========')
    console.log(error)
  }
}
