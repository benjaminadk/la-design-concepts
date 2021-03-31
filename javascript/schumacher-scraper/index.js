const data = require("./data")
const axios = require("axios").default
const fs = require("fs")

const main = async () => {
  let res = []
  let base = "https://schumacher-api-prd.azurewebsites.net/api/products/"

  for (let d of data) {
    try {
      let r = await axios({
        method: "GET",
        url: `${base}${d}`,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NzVjMThkYS05YzZjLTRmNTEtYjFlYy1jNGE1NjMyNDY4NzQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNDc5NzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJiZW5AbGFkZXNpZ25jb25jZXB0cy5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQkVOIEJST09LRSIsImlkZW50aXR5dHlwZSI6MSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoid2ViVXNlciIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjMvMTUvMjAyMiA0OjE3OjU3IFBNIiwib3JnYW5pemF0aW9uc2lkIjoiMTM3OTgyOCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiYmVuQGxhZGVzaWduY29uY2VwdHMuY29tIiwiZXhwIjoxNjQ3MzYxMDc3LCJpc3MiOiJodHRwczovL3NjaHVtYWNoZXItYXBpLXByZC5henVyZXdlYnNpdGVzLm5ldCJ9.aVKfPL-YAk25Fb1Gd39CFDEXpuXMiB7uql3duIKGBoM",
        },
      })
      r && r.data && res.push(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  fs.writeFileSync("data.json", JSON.stringify(res))
}

main()
