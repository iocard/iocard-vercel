const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname,'..','data')
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true})
const usersFile = path.join(dataDir,'users.json')
const adminsFile = path.join(dataDir,'admins.json')
const sessionsFile = path.join(dataDir,'sessions.json')

function readJSON(file, defaultVal){ try{ if(!fs.existsSync(file)) return defaultVal; const s=fs.readFileSync(file,'utf8'); return JSON.parse(s||'[]') }catch(e){ return defaultVal } }
function writeJSON(file, data){ fs.writeFileSync(file, JSON.stringify(data,null,2),'utf8') }

module.exports = { readJSON, writeJSON, usersFile, adminsFile, sessionsFile }