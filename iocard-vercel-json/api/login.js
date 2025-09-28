const { readJSON, writeJSON } = require('./_data')
const path = require('path'), crypto = require('crypto')
module.exports = (req,res)=>{
  if(req.method!=='POST') return res.statusCode=405, res.end('Method not allowed')
  let body=''
  req.on('data',c=>body+=c)
  req.on('end',()=>{
    try{
      const {username,password} = JSON.parse(body)
      const admins = readJSON(path.join(__dirname,'..','data','admins.json'),[])
      const found = admins.find(a=>a.username===username && a.password===password)
      if(!found) return res.statusCode=401, res.end(JSON.stringify({error:'invalid'}))
      const sessionsFile = path.join(__dirname,'..','data','sessions.json')
      const sessions = readJSON(sessionsFile,{})
      const token = crypto.randomBytes(16).toString('hex')
      sessions[token]=username
      writeJSON(sessionsFile,sessions)
      res.end(JSON.stringify({token}))
    }catch(e){ res.statusCode=400; res.end(JSON.stringify({error:'bad'})) }
  })
}