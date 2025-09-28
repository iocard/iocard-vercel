import React, {useEffect, useState} from 'react'

export default function PublicProfile({username}){
  const [profile,setProfile] = useState(null)
  useEffect(()=>{
    fetch('/api/user/'+username+'.js').then(r=>{ if(r.ok) return r.json(); else return null }).then(d=>setProfile(d))
  },[username])

  if(profile===null) return <div className="container"><p>Perfil no encontrado</p></div>
  return (
    <div className="container" style={{textAlign:'center'}}>
      <h2>{profile.alias || profile.username}</h2>
      <p>Color: <span style={{display:'inline-block',width:20,height:20,background:profile.color}}></span> {profile.color}</p>
      <div style={{marginTop:20}}>
        {profile.links && profile.links.map((l,i)=> <a key={i} className="btn" href={l.url} target="_blank" rel="noreferrer" style={{margin:'6px'}}>{l.label}</a>)}
      </div>
      <div style={{marginTop:10}}>
        <button className="btn" onClick={()=>{navigator.clipboard.writeText(profile.alias||''); alert('Copiado')}}>Copiar Alia</button>
      </div>
      {profile.googleReview && <div style={{marginTop:10}}><a className="btn" href={profile.googleReview} target="_blank" rel="noreferrer">Dejar reseña en Google</a></div>}
      <div style={{marginTop:10}}>
        <button className="btn" onClick={()=>{
          const v = ['BEGIN:VCARD','VERSION:3.0', profile.alias?`FN:${profile.alias}`:'', profile.vcard_phone?`TEL;TYPE=CELL:${profile.vcard_phone}`:'', profile.vcard_email?`EMAIL:${profile.vcard_email}`:'', 'END:VCARD'].filter(Boolean).join('\r\n')
          const blob = new Blob([v],{type:'text/vcard'})
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href=url; a.download = (profile.username||'contact') + '.vcf'; a.click(); URL.revokeObjectURL(url)
        }}>Descargar vCard</button>
      </div>
    </div>
  )
}