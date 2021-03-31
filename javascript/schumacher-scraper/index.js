const data = require('./iksel')
const axios = require('axios').default
const fs = require('fs')

const main = async () => {
  let res = []
  let base = 'https://schumacher-api-prd.azurewebsites.net/api/products/'

  for(let d of data) {
    try {
      let r = await axios({
        method: 'GET',
        url: `${base}${d}`,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxMDM0MjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJEaWFubmVAbGFkZXNpZ25jb25jZXB0cy5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRGlhbm5lQGxhZGVzaWduY29uY2VwdHMuY29tIiwib3JnYW5pemF0aW9uc2lkIjoiMTM3OTgyOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMTAvNS8yMDIxIDk6MjQ6NDUgUE0iLCJleHAiOjE2MzM0NjkwODUsImlzcyI6Imh0dHBzOi8vc2NodW1hY2hlci1hcGktcHJkLmF6dXJld2Vic2l0ZXMubmV0In0.R7YjhEikuUeHdv4beagz36KDJplXiupi7_npL1rz3E4'
        }
      })
      r && r.data && res.push(r.data)
    } catch(error) {
      console.log(error)
    }
  
  }

  fs.writeFileSync('iksel.json', JSON.stringify(res))
}

main()