const mjml2html = require('mjml')

// Table
function createTable(rankings) {
  return `
    <mj-table border="2px solid #86c456">
      <tr style="background-color:#86c456; color:#ffffff; font-size: 18px; text-align:center;">
        <th style="padding: 15px 0;">Product</th>
        <th style="padding: 15px 0;">Title</th>
        <th style="padding: 15px 0;">Price</th>
      </tr>
      ${rankings
        .map(
          (ranking, i) => `
        <tr style="font-size: 14px; text-align:center; background-color:${
          i % 2 === 0 ? '#eee' : '#fff'
        };">
          <td>${ranking.brand}</td>
          <td>${ranking.q}</td>
          <td>${ranking.rank}</td>
        </tr>
      `
        )
        .toString()
        .replace(/,/g, '')}
    </mj-table>`
}

module.exports = async report => {
  const html = await mjml2html(`
    <mjml>
        <head></head>
      <mj-body background-color="#f5f5f5">
          <mj-section background-color="#fff;">
            <mj-column>
              <mj-image src="https://ladesignconcepts.com/images/ladc_logo0820.png" width="125px" padding="20px 0"></mj-image>
              <mj-text align="center" color="#333333" font-family="Arial" font-size="40px">LA Design Concepts</mj-text>
              <mj-text font-family='Arial' font-size="30px" align="center">Google SEO Rankings</mj-text>
            </mj-column>
          </mj-section>
        <mj-section>
          <mj-column>
            ${createTable(report)}
            <mj-text align="center" color="#333333" font-family="Arial" font-size="14px">* n/a - results not on page 1</mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#fff;">
          <mj-column>
            <mj-text align="center" color="#333333" font-family="Arial" font-size="16px">Copyright 2020 LA Design Concepts</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `)

  return html.html
}
