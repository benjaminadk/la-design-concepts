const fs = require('fs')
const data = require('./data')

fs.writeFile('manufacturers.json',JSON.stringify(data),err=>{
    if(err){
        console.log(err)
    }
    console.log('done')
})