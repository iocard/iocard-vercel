import React, {useEffect, useState} from 'react'
import Admin from './views/Admin'
import PublicProfile from './views/PublicProfile'

export default function App(){
  const path = window.location.pathname
  if(path.startsWith('/admin')) return <Admin />
  if(path.startsWith('/u/')){
    const username = path.split('/u/')[1]
    return <PublicProfile username={username} />
  }
  return (
    <div className="container">
      <div className="header"><h2>ioCARD - Demo (JSON)</h2><a className="btn" href="/admin">Admin</a></div>
      <p>Crear o visitar perfiles: /u/username</p>
      <p>Ejemplo: <a href="/u/juan">/u/juan</a></p>
    </div>
  )
}