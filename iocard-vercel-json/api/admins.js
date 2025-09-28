const { readJSON } = require('./_data')
const path = require('path')
module.exports = (req,res)=>{
  const admins = readJSON(path.join(__dirname,'..','data','admins.json'),[])
  res.setHeader('Content-Type','application/json')
  res.end(JSON.stringify(admins))
}