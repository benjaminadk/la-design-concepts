const axios = require('axios')
const { readdir } = require('./utils')

const getAccessToken = async () => {
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN
  const client_id = process.env.GOOGLE_DRIVE_KEY
  const client_secret = process.env.GOOGLE_DRIVE_SECRET
  const refresh_url = 'https://www.googleapis.com/oauth2/v4/token'

  const parentFolderId = '1tKxPYw84KjDLD4gsRzCy_5rkCpW8Fchf'

  try {
    const response1 = await axios({
      method: 'POST',
      url: refresh_url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token
      }
    })

    const access_token = response1.data.access_token

    const response2 = await axios({
      method: 'GET',
      url: 'https://www.googleapis.com/drive/v3/files',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const list = response2.data

    console.log(list.files[0].name)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAccessToken
}
