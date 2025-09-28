const { readJSON, writeJSON } = require('./_data')
const path = require('path')
module.exports = (req,res)=>{
  if(req.method!=='POST') return res.statusCode=405, res.end('Method not allowed')
  let body=''
  req.on('data',c=>body+=c)
  req.on('end',()=>{
    try{
      const obj = JSON.parse(body)
      const token = req.headers['x-admin-token'] || ''
      const sessions = readJSON(path.join(__dirname,'..','data','sessions.json'),{})
      if(!sessions[token]) return res.statusCode=403, res.end(JSON.stringify({error:'forbidden'}))
      const usersFile = path.join(__dirname,'..','data','users.json')
      const users = readJSON(usersFile,[])
      const idx = users.findIndex(u=>u.username===obj.username)
      if(idx>=0) users[idx]=obj; else users.push(obj)
      writeJSON(usersFile,users)
      res.end(JSON.stringify({ok:true}))
    }catch(e){ res.statusCode=400; res.end(JSON.stringify({error:'bad request'})) }
  })
}