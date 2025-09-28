const { nanoid } = require('nanoid');
const crypto = require('crypto');

function generateId() { return nanoid(10); }
function generateEditToken() { return crypto.randomBytes(20).toString('hex'); }

function createVCard(profile, links){
  let v = [];
  v.push('BEGIN:VCARD');
  v.push('VERSION:3.0');
  if(profile.vcard_name) v.push(`FN:${profile.vcard_name}`);
  if(profile.vcard_phone) v.push(`TEL;TYPE=CELL:${profile.vcard_phone}`);
  if(profile.vcard_email) v.push(`EMAIL:${profile.vcard_email}`);
  if(links && links.length) {
    const note = links.map(l=>`${l.title}: ${l.url}`).join(' | ');
    v.push(`NOTE:${note}`);
  }
  v.push('END:VCARD');
  return v.join('\r\n');
}

module.exports = { generateId, generateEditToken, createVCard };