const express = require('express');
const router = express.Router();
const db = require('./db');
const { generateId, generateEditToken, createVCard } = require('./utils');

router.post('/api/profiles', (req, res) => {
  const body = req.body;
  const id = generateId();
  const editToken = generateEditToken();
  const slug = (body.slug || body.name || 'user')
    .toString().toLowerCase().replace(/[^a-z0-9\-]/g,'-').slice(0,40);

  const stmt = db.prepare(`INSERT INTO profiles (id, slug, name, bio, color, copyAliaText, googleReviewUrl, vcard_name, vcard_phone, vcard_email, editToken) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  try{
    stmt.run(id, slug, body.name||'', body.bio||'', body.color||'#111827', body.copyAliaText||'', body.googleReviewUrl||'', body.vcard_name||'', body.vcard_phone||'', body.vcard_email||'', editToken);
    res.json({ id, slug, editToken });
  }catch(e){
    res.status(400).json({ error: e.message });
  }
});

router.get('/api/profiles/:slug', (req, res) => {
  const slug = req.params.slug;
  const p = db.prepare('SELECT * FROM profiles WHERE slug = ?').get(slug);
  if(!p) return res.status(404).json({error: 'Not found'});
  const links = db.prepare('SELECT * FROM links WHERE profile_id = ? ORDER BY position').all(p.id);
  res.json({ profile: p, links });
});

router.put('/api/profiles/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const existing = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
  if(!existing) return res.status(404).json({error:'Not found'});
  if(!body.editToken || body.editToken !== existing.editToken) return res.status(403).json({error:'Forbidden'});

  const stmt = db.prepare(`UPDATE profiles SET name=?, bio=?, color=?, copyAliaText=?, googleReviewUrl=?, vcard_name=?, vcard_phone=?, vcard_email=? WHERE id = ?`);
  stmt.run(body.name||existing.name, body.bio||existing.bio, body.color||existing.color, body.copyAliaText||existing.copyAliaText, body.googleReviewUrl||existing.googleReviewUrl, body.vcard_name||existing.vcard_name, body.vcard_phone||existing.vcard_phone, body.vcard_email||existing.vcard_email, id);
  res.json({ ok: true });
});

router.post('/api/profiles/:id/links', (req,res)=>{
  const id = req.params.id; const body = req.body; const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
  if(!profile) return res.status(404).json({error:'profile not found'});
  if(!body.editToken || body.editToken !== profile.editToken) return res.status(403).json({error:'Forbidden'});
  const linkId = generateId();
  const pos = body.position || 999;
  db.prepare('INSERT INTO links (id, profile_id, title, url, position) VALUES (?,?,?,?,?)').run(linkId,id,body.title,body.url,pos);
  res.json({ id: linkId });
});

router.delete('/api/links/:id', (req,res)=>{
  const id = req.params.id; const editToken = req.body.editToken;
  const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
  if(!link) return res.status(404).json({error:'link not found'});
  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(link.profile_id);
  if(!profile || profile.editToken!==editToken) return res.status(403).json({error:'Forbidden'});
  db.prepare('DELETE FROM links WHERE id = ?').run(id);
  res.json({ ok:true });
});

router.get('/api/profiles/:slug/vcard', (req,res)=>{
  const slug = req.params.slug;
  const p = db.prepare('SELECT * FROM profiles WHERE slug = ?').get(slug);
  if(!p) return res.status(404).send('Not found');
  const links = db.prepare('SELECT * FROM links WHERE profile_id = ? ORDER BY position').all(p.id);
  const vcard = createVCard(p, links);
  res.setHeader('Content-disposition', `attachment; filename=${p.slug || 'contact'}.vcf`);
  res.setHeader('Content-Type', 'text/vcard');
  res.send(vcard);
});

module.exports = router;