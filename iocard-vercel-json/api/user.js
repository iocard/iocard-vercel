const { readJSON } = require('./_data')
const path = require('path')
module.exports = (req,res)=>{
  const parts = req.url.split('/').filter(Boolean)
  // /api/user.js or /api/user/<name>.js
  const last = parts[parts.length-1] || ''
  const maybe = last.replace('.js','')
  const users = readJSON(path.join(__dirname,'..','data','users.json'),[])
  if(maybe && maybe!=='user.js'){
    const u = users.find(x=>x.username===maybe)
    if(!u){ res.statusCode=404; return res.end(JSON.stringify({error:'not found'})) }
    res.setHeader('Content-Type','application/json'); return res.end(JSON.stringify(u))
  }
  res.setHeader('Content-Type','application/json')
  res.end(JSON.stringify(users))
}